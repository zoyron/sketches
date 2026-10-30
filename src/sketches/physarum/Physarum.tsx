import React, { useRef, useState } from "react";
import * as THREE from "three";
import { getDeviceCapabilities } from "../../lib/deviceLOD";
import { isTouchDevice } from "../../lib/isTouchDevice";
import { useThreeCanvas } from "../../lib/useThreeCanvas";
import quadVertexShader from "../../lib/shaders/fullscreen.vert.glsl";
import seedFragmentShader from "./shaders/seed.frag.glsl";
import agentsFragmentShader from "./shaders/agents.frag.glsl";
import depositVertexShader from "./shaders/deposit.vert.glsl";
import depositFragmentShader from "./shaders/deposit.frag.glsl";
import trailFragmentShader from "./shaders/trail.frag.glsl";
import displayFragmentShader from "./shaders/display.frag.glsl";
import copyFragmentShader from "./shaders/copy.frag.glsl";
import downsampleFragmentShader from "./shaders/downsample.frag.glsl";
import blurFragmentShader from "./shaders/blur.frag.glsl";

// Trail-map pixel budget per device tier; the map is never larger than the CSS viewport
const MAP_PIXEL_BUDGET = { low: 900_000, mid: 1_500_000, high: 2_200_000 };
const SIM_STEP = 1 / 60;
const MAX_STEPS_PER_FRAME = 3;
const FADE_DURATION = 0.35;
const BLOOM_DOWNSAMPLE = 4;

// Colony behaviour (Jones, 2010), distances in trail-map pixels
const AGENT_DENSITY = 0.2; // agents per trail-map pixel
const SENSOR_ANGLE = 90; // degrees
const TURN_ANGLE = 45; // degrees
const SENSOR_OFFSET = 6;
const STEP_SIZE = 1;
const JITTER = 0.25; // radians of random wobble per step
const RESPAWN = 0.001; // chance per step that an agent restarts somewhere random
const TRAIL_RETAIN = 0.85; // fraction of trail kept each step
const TRAIL_DIFFUSE = 1; // 0 = no blur, 1 = full 3x3 blur each step

// Look: a ramp from faint trail to dense vein
const PALETTE = { low: "#150a3d", mid: "#7c5cff", high: "#e6f0ff" };
const EXPOSURE = 0.25;
const GLOW = 0.35;

// Feeding: the pointer drags a soft brush that lays food, agents smell it and surge towards it
const FEED_STRENGTH = 2; // food laid per pass of the brush, whatever the pointer speed
const FEED_DWELL = 0.02; // food per step under a resting pointer
const FEED_RADIUS = 16; // map px
const FOOD_MAX = 3; // feeding saturates here, so retraced or resting spots don't flare up
const FOOD_ATTRACTION = 4;
const FOOD_SENSOR_OFFSET = 20; // map px; food is smelled from further away than trail
const FOOD_SURGE = 2; // extra speed of agents that smell food, as a multiple of STEP_SIZE
const FOOD_DEPOSIT = 1.25; // extra trail they lay, as a multiple of a normal deposit
const FOOD_RETAIN = 0.985;
const FOOD_GLOW = 0.2; // faint haze over fresh food, so a stroke registers before agents arrive
const FEED_IDLE_DELAY = 1.5; // seconds a resting pointer keeps feeding
const FEED_IDLE_FADE = 1;
const BRUSH_SMOOTHING = 0.012; // seconds the brush takes to follow the pointer, rounding off corners
const BRUSH_POINTS = 5; // brush positions per step, so fast curves stay round; matches uBrush in trail.frag.glsl

const MAX_RIPPLES = 4;
const RIPPLE_SPEED = 3; // map px per step
const RIPPLE_WIDTH = 10; // map px
const RIPPLE_STEPS = 100;

const TAP_MAX_DURATION = 300; // ms
const TAP_MAX_DISTANCE = 10; // CSS px

interface Ripple {
  x: number; // 0-1
  y: number; // 0-1
  age: number; // steps
}

const Physarum: React.FC = () => {
  const reseedRef = useRef<(() => void) | null>(null);
  const [isTouch] = useState(isTouchDevice);
  const hint = isTouch ? "Drag to feed · Tap to ripple" : "Move to feed · Click to ripple";

  const mountRef = useThreeCanvas((renderer) => {
    const { tier } = getDeviceCapabilities();

    // Renderer
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    const canvas = renderer.domElement;

    // Agents need full floats for sub-pixel steps; the trail only needs half floats, which can also be blended
    const agentType = renderer.extensions.has("EXT_color_buffer_float")
      ? THREE.FloatType
      : THREE.HalfFloatType;

    const createAgentTarget = (width: number, height: number) =>
      new THREE.WebGLRenderTarget(width, height, {
        type: agentType,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        depthBuffer: false,
      });

    // Repeat wrapping makes the world a seamless torus
    const createTrailTarget = (width: number, height: number) =>
      new THREE.WebGLRenderTarget(width, height, {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.RepeatWrapping,
        wrapT: THREE.RepeatWrapping,
        depthBuffer: false,
      });

    const createBloomTargets = (size: THREE.Vector2) => {
      const width = Math.ceil(size.x / BLOOM_DOWNSAMPLE);
      const height = Math.ceil(size.y / BLOOM_DOWNSAMPLE);
      return [createTrailTarget(width, height), createTrailTarget(width, height)];
    };

    const computeMapSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.min(1, Math.sqrt(MAP_PIXEL_BUDGET[tier] / (width * height)));
      return new THREE.Vector2(
        Math.max(1, Math.round(width * scale)),
        Math.max(1, Math.round(height * scale)),
      );
    };

    const mapSize = computeMapSize();
    let trailTargets = [
      createTrailTarget(mapSize.x, mapSize.y),
      createTrailTarget(mapSize.x, mapSize.y),
    ];
    let bloomTargets = createBloomTargets(mapSize);
    let agentTargets: THREE.WebGLRenderTarget[] = [];
    let trailIndex = 0;
    let agentIndex = 0;
    let frame = 0;

    // Full-screen passes
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quadGeometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(quadGeometry);
    quad.frustumCulled = false;
    const quadScene = new THREE.Scene();
    quadScene.add(quad);

    const renderPass = (
      material: THREE.ShaderMaterial,
      target: THREE.WebGLRenderTarget | null,
    ) => {
      quad.material = material;
      renderer.setRenderTarget(target);
      renderer.render(quadScene, camera);
    };

    const createPassMaterial = (
      fragmentShader: string,
      uniforms: Record<string, THREE.IUniform>,
    ) =>
      new THREE.ShaderMaterial({
        vertexShader: quadVertexShader,
        fragmentShader,
        uniforms,
        depthTest: false,
        depthWrite: false,
      });

    const ripples = Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4());

    const seedMaterial = createPassMaterial(seedFragmentShader, {
      uSeed: { value: 0 },
    });

    const agentsMaterial = createPassMaterial(agentsFragmentShader, {
      uAgents: { value: null },
      uTrail: { value: null },
      uMapSize: { value: mapSize },
      uFrame: { value: 0 },
      uSensorAngle: { value: THREE.MathUtils.degToRad(SENSOR_ANGLE) },
      uSensorOffset: { value: SENSOR_OFFSET },
      uTurnAngle: { value: THREE.MathUtils.degToRad(TURN_ANGLE) },
      uStepSize: { value: STEP_SIZE },
      uJitter: { value: JITTER },
      uFoodAttraction: { value: FOOD_ATTRACTION },
      uFoodSensorOffset: { value: FOOD_SENSOR_OFFSET },
      uFoodSurge: { value: FOOD_SURGE },
      uRespawn: { value: RESPAWN },
      uRipples: { value: ripples },
      uRippleWidth: { value: RIPPLE_WIDTH },
      uRippleSpeed: { value: RIPPLE_SPEED },
    });

    const trailMaterial = createPassMaterial(trailFragmentShader, {
      uTrail: { value: null },
      uMapSize: { value: mapSize },
      uDiffuse: { value: TRAIL_DIFFUSE },
      uRetain: { value: TRAIL_RETAIN },
      uFoodRetain: { value: FOOD_RETAIN },
      uBrush: { value: Array.from({ length: BRUSH_POINTS }, () => new THREE.Vector2()) },
      uFeed: { value: 0 },
      uFeedDwell: { value: 0 },
      uFeedRadius: { value: FEED_RADIUS },
      uFoodMax: { value: FOOD_MAX },
      uRipples: { value: ripples },
      uRippleWidth: { value: RIPPLE_WIDTH },
    });

    const downsampleMaterial = createPassMaterial(downsampleFragmentShader, {
      uSource: { value: null },
      uSourceTexel: { value: new THREE.Vector2() },
    });

    const blurMaterial = createPassMaterial(blurFragmentShader, {
      uSource: { value: null },
      uDirection: { value: new THREE.Vector2() },
    });

    const displayMaterial = createPassMaterial(displayFragmentShader, {
      uTrail: { value: null },
      uBloom: { value: null },
      uLow: { value: new THREE.Color(PALETTE.low) },
      uMid: { value: new THREE.Color(PALETTE.mid) },
      uHigh: { value: new THREE.Color(PALETTE.high) },
      uExposure: { value: EXPOSURE },
      uGlow: { value: GLOW },
      uFoodGlow: { value: FOOD_GLOW },
      uFade: { value: 0 },
      uFrame: { value: 0 },
    });

    const copyMaterial = createPassMaterial(copyFragmentShader, {
      uSource: { value: null },
    });

    // Every agent is drawn as a single additive point into the trail map
    const depositMaterial = new THREE.ShaderMaterial({
      vertexShader: depositVertexShader,
      fragmentShader: depositFragmentShader,
      uniforms: {
        uAgents: { value: null },
        uFoodDeposit: { value: FOOD_DEPOSIT },
      },
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      depthTest: false,
      depthWrite: false,
    });

    let agentGeometry = new THREE.BufferGeometry();
    const agentPoints = new THREE.Points(agentGeometry, depositMaterial);
    agentPoints.frustumCulled = false;
    const depositScene = new THREE.Scene();
    depositScene.add(agentPoints);

    const allocateAgents = (count: number) => {
      const width = Math.ceil(Math.sqrt(count));
      const height = Math.ceil(count / width);

      agentTargets.forEach((target) => target.dispose());
      agentTargets = [createAgentTarget(width, height), createAgentTarget(width, height)];

      // Each vertex carries the texel address of its agent
      const references = new Float32Array(width * height * 3);
      for (let i = 0; i < width * height; i++) {
        references[i * 3] = ((i % width) + 0.5) / width;
        references[i * 3 + 1] = (Math.floor(i / width) + 0.5) / height;
      }
      agentGeometry.dispose();
      agentGeometry = new THREE.BufferGeometry();
      agentGeometry.setAttribute("position", new THREE.BufferAttribute(references, 3));
      agentPoints.geometry = agentGeometry;
    };

    const activeRipples: Ripple[] = [];

    const reseed = () => {
      allocateAgents(Math.round(mapSize.x * mapSize.y * AGENT_DENSITY));
      seedMaterial.uniforms.uSeed.value = Math.floor(Math.random() * 1_000_000);
      agentIndex = 0;
      renderPass(seedMaterial, agentTargets[0]);

      trailTargets.forEach((target) => {
        renderer.setRenderTarget(target);
        renderer.clear();
      });
      activeRipples.length = 0;
    };

    reseed();

    // Reseeding fades out, restarts the colony, then fades back in
    let fade = 0;
    let reseedPending = false;
    reseedRef.current = () => {
      reseedPending = true;
    };

    // Ripples
    const addRipple = (x: number, y: number) => {
      if (activeRipples.length === MAX_RIPPLES) activeRipples.shift();
      activeRipples.push({ x, y, age: 0 });
    };

    const updateRipples = () => {
      for (let i = activeRipples.length - 1; i >= 0; i--) {
        if (activeRipples[i].age > RIPPLE_STEPS) activeRipples.splice(i, 1);
      }
      ripples.forEach((uniform, i) => {
        const ripple = activeRipples[i];
        if (!ripple) {
          uniform.set(0, 0, 0, 0);
          return;
        }
        const life = ripple.age / RIPPLE_STEPS;
        uniform.set(
          ripple.x * mapSize.x,
          ripple.y * mapSize.y,
          ripple.age * RIPPLE_SPEED,
          1 - life * life,
        );
        ripple.age++;
      });
    };

    // Pointer: moving lays food, a tap sends a ripple
    const pointer = {
      active: false,
      lastMove: 0,
      pressed: false,
      downTime: 0,
      downX: 0,
      downY: 0,
    };

    // The brush chases the pointer through every sample it reported (CSS px, y up)
    const brush = new THREE.Vector2();
    const brushAim = new THREE.Vector2(); // last pointer sample the brush has been fed
    const brushPath: THREE.Vector2[] = []; // samples since then
    const brushFollow = 1 - Math.exp(-SIM_STEP / (BRUSH_POINTS - 1) / BRUSH_SMOOTHING);
    const brushTarget = new THREE.Vector2();

    const updatePointer = (event: PointerEvent) => {
      // Coalesced events hold every sample since the last event, keeping fast curves round
      const coalesced = event.getCoalescedEvents?.() ?? [];
      for (const sample of coalesced.length > 0 ? coalesced : [event]) {
        const point = new THREE.Vector2(sample.clientX, window.innerHeight - sample.clientY);
        if (pointer.active) {
          brushPath.push(point);
        } else {
          brush.copy(point);
          brushAim.copy(point);
          brushPath.length = 0;
          pointer.active = true;
        }
      }
      pointer.lastMove = performance.now();
    };

    // Position at a given distance along the pending pointer path
    const pointOnBrushPath = (distance: number, out: THREE.Vector2) => {
      let from = brushAim;
      for (const to of brushPath) {
        const length = from.distanceTo(to);
        if (distance <= length) return out.lerpVectors(from, to, length > 0 ? distance / length : 1);
        distance -= length;
        from = to;
      }
      return out.copy(from);
    };

    // Moves the brush through its share of this frame's path and hands its positions to the trail pass
    const advanceBrush = (stepIndex: number, stepCount: number, pathLength: number) => {
      const points = trailMaterial.uniforms.uBrush.value as THREE.Vector2[];
      const scaleX = mapSize.x / window.innerWidth;
      const scaleY = mapSize.y / window.innerHeight;
      const segments = BRUSH_POINTS - 1;
      points.forEach((point, i) => {
        if (i > 0) {
          const progress = (stepIndex * segments + i) / (stepCount * segments);
          brush.lerp(pointOnBrushPath(progress * pathLength, brushTarget), brushFollow);
        }
        point.set(brush.x * scaleX, brush.y * scaleY);
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      updatePointer(event);
      pointer.pressed = true;
      pointer.downTime = event.timeStamp;
      pointer.downX = event.clientX;
      pointer.downY = event.clientY;
    };

    const handlePointerUp = (event: PointerEvent) => {
      const isTap =
        pointer.pressed &&
        event.timeStamp - pointer.downTime < TAP_MAX_DURATION &&
        Math.hypot(event.clientX - pointer.downX, event.clientY - pointer.downY) < TAP_MAX_DISTANCE;
      if (isTap) {
        addRipple(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
      }
      pointer.pressed = false;
      if (event.pointerType !== "mouse") pointer.active = false;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.pressed = false;
    };

    // Resizing resamples the trail into a new map; agent positions are normalised so they carry over
    const handleResize = () => {
      const nextSize = computeMapSize();
      if (nextSize.equals(mapSize)) return;

      const resized = [
        createTrailTarget(nextSize.x, nextSize.y),
        createTrailTarget(nextSize.x, nextSize.y),
      ];
      copyMaterial.uniforms.uSource.value = trailTargets[trailIndex].texture;
      renderPass(copyMaterial, resized[0]);
      [...trailTargets, ...bloomTargets].forEach((target) => target.dispose());
      trailTargets = resized;
      trailIndex = 0;
      mapSize.copy(nextSize);
      bloomTargets = createBloomTargets(mapSize);
    };

    // Simulation: sense & move, deposit, then diffuse & decay
    const step = (stepIndex: number, stepCount: number, brushPathLength: number) => {
      updateRipples();
      advanceBrush(stepIndex, stepCount, brushPathLength);

      const agentsRead = agentTargets[agentIndex];
      const agentsWrite = agentTargets[1 - agentIndex];
      const trailRead = trailTargets[trailIndex];
      const trailWrite = trailTargets[1 - trailIndex];

      agentsMaterial.uniforms.uAgents.value = agentsRead.texture;
      agentsMaterial.uniforms.uTrail.value = trailRead.texture;
      agentsMaterial.uniforms.uFrame.value = frame;
      renderPass(agentsMaterial, agentsWrite);

      depositMaterial.uniforms.uAgents.value = agentsWrite.texture;
      renderer.setRenderTarget(trailRead);
      renderer.render(depositScene, camera);

      trailMaterial.uniforms.uTrail.value = trailRead.texture;
      renderPass(trailMaterial, trailWrite);

      agentIndex = 1 - agentIndex;
      trailIndex = 1 - trailIndex;
      frame++;
    };

    // Bloom: quarter-resolution copy of the trail, blurred horizontally then vertically
    const renderBloom = (trail: THREE.WebGLRenderTarget) => {
      const [bloomA, bloomB] = bloomTargets;
      downsampleMaterial.uniforms.uSource.value = trail.texture;
      downsampleMaterial.uniforms.uSourceTexel.value.set(1 / trail.width, 1 / trail.height);
      renderPass(downsampleMaterial, bloomA);

      blurMaterial.uniforms.uSource.value = bloomA.texture;
      blurMaterial.uniforms.uDirection.value.set(1 / bloomA.width, 0);
      renderPass(blurMaterial, bloomB);

      blurMaterial.uniforms.uSource.value = bloomB.texture;
      blurMaterial.uniforms.uDirection.value.set(0, 1 / bloomA.height);
      renderPass(blurMaterial, bloomA);
      return bloomA;
    };

    let lastTime = performance.now();
    let accumulator = 0;

    const tick = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (reseedPending) {
        fade = Math.max(0, fade - delta / FADE_DURATION);
        if (fade === 0) {
          reseed();
          reseedPending = false;
        }
      } else {
        fade = Math.min(1, fade + delta / FADE_DURATION);
      }

      // A resting pointer stops feeding after a moment so the colony can wander again
      const idle = (now - pointer.lastMove) / 1000;
      const feed = pointer.active
        ? 1 - THREE.MathUtils.smoothstep(idle, FEED_IDLE_DELAY, FEED_IDLE_DELAY + FEED_IDLE_FADE)
        : 0;
      trailMaterial.uniforms.uFeed.value = FEED_STRENGTH * feed;
      trailMaterial.uniforms.uFeedDwell.value = FEED_DWELL * feed;

      // Fixed 60 Hz steps; rounding keeps one step per frame on 60 Hz displays despite timer jitter
      accumulator += delta;
      const steps = Math.min(Math.round(accumulator / SIM_STEP), MAX_STEPS_PER_FRAME);
      accumulator = steps === MAX_STEPS_PER_FRAME ? 0 : accumulator - steps * SIM_STEP;

      // The pointer's movement since the last step is shared evenly between this frame's steps
      if (steps > 0) {
        let brushPathLength = 0;
        brushPath.forEach((point, i) => {
          brushPathLength += point.distanceTo(i > 0 ? brushPath[i - 1] : brushAim);
        });
        for (let i = 0; i < steps; i++) step(i, steps, brushPathLength);
        if (brushPath.length > 0) brushAim.copy(brushPath[brushPath.length - 1]);
        brushPath.length = 0;
      }

      const trail = trailTargets[trailIndex];
      displayMaterial.uniforms.uTrail.value = trail.texture;
      displayMaterial.uniforms.uBloom.value = renderBloom(trail).texture;
      displayMaterial.uniforms.uFade.value = fade * fade * (3 - 2 * fade);
      displayMaterial.uniforms.uFrame.value = frame;
    };

    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointercancel", handlePointerLeave);

    return {
      update: tick,
      render() {
        renderPass(displayMaterial, null);
      },
      resize: handleResize,
      dispose() {
        canvas.removeEventListener("pointermove", updatePointer);
        canvas.removeEventListener("pointerdown", handlePointerDown);
        canvas.removeEventListener("pointerup", handlePointerUp);
        canvas.removeEventListener("pointerleave", handlePointerLeave);
        canvas.removeEventListener("pointercancel", handlePointerLeave);
        reseedRef.current = null;

        // Properly dispose of Three.js resources
        [...agentTargets, ...trailTargets, ...bloomTargets].forEach((target) => target.dispose());
        [
          seedMaterial,
          agentsMaterial,
          depositMaterial,
          trailMaterial,
          downsampleMaterial,
          blurMaterial,
          displayMaterial,
          copyMaterial,
        ].forEach((material) => material.dispose());
        quadGeometry.dispose();
        agentGeometry.dispose();
      },
    };
  }, { powerPreference: "high-performance" });

  return (
    <>
      <div ref={mountRef} className="absolute inset-0 bg-black" />

      <div className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-3">
        {/* On narrow screens the hint sits above the button instead of beside it */}
        <p className="sm:hidden px-3 py-2 border border-white/15 bg-noir/60 backdrop-blur-lg font-body text-[10px] uppercase tracking-[0.25em] text-white/60 select-none">
          {hint}
        </p>

        <div className="flex h-12 border border-white/15 bg-noir/60 backdrop-blur-lg">
          <p className="hidden sm:flex items-center px-5 font-body text-[11px] uppercase tracking-[0.25em] text-white/55 select-none">
            {hint}
          </p>
          <div className="hidden sm:block w-px bg-white/15" />

          <button
            onClick={() => reseedRef.current?.()}
            aria-label="Reseed the colony"
            className="px-5 flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/5 font-body text-sm tracking-wider transition-colors duration-300 group"
          >
            <svg
              className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            <span>Reseed</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Physarum;
