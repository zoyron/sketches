import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/** Fixed simulation tick, so the fluid moves the same at 60, 120 or 144 Hz */
const TICK = 1 / 60;
/** Ticks one frame may catch up; a longer stall is dropped instead of replayed */
const MAX_TICKS_PER_FRAME = 3;
/** Velocity solver passes per tick */
const SUBSTEPS = 2;

/** Grid long side in cells; the short side follows the screen's aspect so cells stay square */
const GRID_LONG = 384;
const GRID_LONG_COMPACT = 256;
const GRID_MIN = 32;
/** Screens narrower than this use the compact grid */
const COMPACT_WIDTH = 768;
/** The display pass only upsamples a soft, coarse grid, so extra device pixels buy nothing */
const PIXEL_RATIO = 1;

/** A pointer that pauses longer than this, or jumps further (share of the long side), starts a fresh stroke */
const STROKE_GAP_MS = 100;
const STROKE_MAX_JUMP = 0.25;
/** An unattended window keeps flowing this long before holding still, so focus that bounces straight back never stutters */
const IDLE_GRACE_MS = 1000;

const QUAD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Velocity solver. Texel layout: xy velocity in cells, z density, w curl.
const VELOCITY_FRAG = /* glsl */ `
  uniform sampler2D velocityField;
  uniform vec2 resolution;
  uniform vec2 pointer;
  uniform vec2 drag;
  varying vec2 vUv;

  #define dt 0.13
  #define vorticityThreshold 0.22
  #define velocityThreshold 10.0
  #define viscosityThreshold 0.7

  void main() {
    vec2 uv = vUv;
    vec2 stepSize = 1.0 / resolution;
    float k = 0.2, s = k / dt;

    vec4 fluidData = texture2D(velocityField, uv);
    vec4 fr = texture2D(velocityField, uv + vec2(stepSize.x, 0.0));
    vec4 fl = texture2D(velocityField, uv - vec2(stepSize.x, 0.0));
    vec4 ft = texture2D(velocityField, uv + vec2(0.0, stepSize.y));
    vec4 fd = texture2D(velocityField, uv - vec2(0.0, stepSize.y));

    vec3 ddx = (fr - fl).xyz * 0.5;
    vec3 ddy = (ft - fd).xyz * 0.5;
    float divergence = ddx.x + ddy.y;
    vec2 densityDiff = vec2(ddx.z, ddy.z);

    fluidData.z -= dt * dot(vec3(densityDiff, divergence), fluidData.xyz);

    vec2 laplacian = fr.xy + fl.xy + ft.xy + fd.xy - 4.0 * fluidData.xy;
    vec2 viscosityForce = viscosityThreshold * laplacian;

    vec2 densityInvariance = s * densityDiff;
    vec2 uvHistory = uv - dt * fluidData.xy * stepSize;
    fluidData.xyw = texture2D(velocityField, uvHistory).xyw;

    // The pointer pushes around its latest position (drag is zero when it did not move); the
    // epsilon keeps the force finite at the pointer itself (the clamp below bounds it either way)
    vec2 p = uv - pointer;
    vec2 extForce = 0.0008 / (dot(p, p) + 1e-6) * drag;

    fluidData.xy += dt * (viscosityForce - densityInvariance + extForce);
    fluidData.xy = max(vec2(0.0), abs(fluidData.xy) - 5e-6) * sign(fluidData.xy);

    fluidData.w = (fd.x - ft.x + fr.y - fl.y);
    vec2 vorticity = vec2(abs(ft.w) - abs(fd.w), abs(fl.w) - abs(fr.w));
    vorticity *= vorticityThreshold / (length(vorticity) + 1e-5) * fluidData.w;
    fluidData.xy += vorticity;

    fluidData.y *= smoothstep(0.5, 0.48, abs(uv.y - 0.5));
    fluidData.x *= smoothstep(0.5, 0.49, abs(uv.x - 0.5));

    fluidData = clamp(fluidData, vec4(vec2(-velocityThreshold), 0.5, -vorticityThreshold),
                                 vec4(vec2(velocityThreshold), 3.0, vorticityThreshold));

    gl_FragColor = fluidData;
  }
`;

// Dye: carried by the flow, fed by the pointer in the chosen colour, fading 1 % per tick
const DYE_FRAG = /* glsl */ `
  uniform sampler2D velocityField;
  uniform sampler2D dyeField;
  uniform vec2 resolution;
  uniform vec2 pointer;
  uniform float ink;
  uniform float seed;
  uniform vec3 fluidColor;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    vec2 uv = vUv;
    vec2 stepSize = 1.0 / resolution;
    vec4 vel = texture2D(velocityField, uv);
    vec4 col = texture2D(dyeField, uv - 0.1 * vel.xy * stepSize * 2.0);

    vec3 rgb = fluidColor * (0.8 + hash(seed) * 0.2);
    // 1 / distance^1.6, written on the squared distance
    vec2 p = uv - pointer;
    col.rgb += ink / pow(dot(p, p) + 1e-7, 0.8) * rgb;

    col = clamp(col, 0.0, 5.0);
    col = max(col - col * 0.01, 0.0);

    gl_FragColor = col;
  }
`;

const DISPLAY_FRAG = /* glsl */ `
  uniform sampler2D dyeField;
  varying vec2 vUv;

  void main() {
    vec4 col = texture2D(dyeField, vUv);
    gl_FragColor = vec4(sqrt(col.rgb), 1.0);
  }
`;

// Carries a field onto a resized grid, rescaling velocities to the new cells
const RESAMPLE_FRAG = /* glsl */ `
  uniform sampler2D source;
  uniform vec4 scale;
  varying vec2 vUv;

  void main() {
    gl_FragColor = texture2D(source, vUv) * scale;
  }
`;

type Pair = [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];

const makeTarget = (width: number, height: number) =>
  new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    depthBuffer: false,
    stencilBuffer: false,
    generateMipmaps: false,
  });

const makePair = (width: number, height: number): Pair => [makeTarget(width, height), makeTarget(width, height)];

const makePass = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
  new THREE.ShaderMaterial({
    vertexShader: QUAD_VERT,
    fragmentShader,
    uniforms,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });

/** Grid cells for a screen size: long side fixed, short side following the aspect */
const gridFor = (width: number, height: number): [number, number] => {
  const long = width < COMPACT_WIDTH ? GRID_LONG_COMPACT : GRID_LONG;
  const aspect = Math.max(width, 1) / Math.max(height, 1);
  return aspect >= 1
    ? [long, Math.max(GRID_MIN, Math.round(long / aspect))]
    : [Math.max(GRID_MIN, Math.round(long * aspect)), long];
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

interface SceneProps {
  fluidColor: THREE.Color;
  /** Whether the simulation advances; when false the last frame holds */
  running: boolean;
  /** Whether the pointer stirs the fluid */
  interactive: boolean;
}

const FluidSimulationScene = ({ fluidColor, running, interactive }: SceneProps) => {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const wantedGrid = gridFor(size.width, size.height);

  const sim = useMemo(() => {
    const grid = new THREE.Vector2();
    const pointer = new THREE.Vector2();
    const drag = new THREE.Vector2();
    const shared = { resolution: { value: grid }, pointer: { value: pointer } };

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    quad.frustumCulled = false;

    return {
      grid,
      pointer,
      drag,
      quad,
      camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      velocityPass: makePass(VELOCITY_FRAG, { ...shared, velocityField: { value: null }, drag: { value: drag } }),
      dyePass: makePass(DYE_FRAG, {
        ...shared,
        velocityField: { value: null },
        dyeField: { value: null },
        ink: { value: 0 },
        seed: { value: 0 },
        fluidColor: { value: new THREE.Vector3() },
      }),
      displayPass: makePass(DISPLAY_FRAG, { dyeField: { value: null } }),
      resamplePass: makePass(RESAMPLE_FRAG, { source: { value: null }, scale: { value: new THREE.Vector4(1, 1, 1, 1) } }),
      velocity: null as Pair | null,
      dye: null as Pair | null,
      accumulator: 0,
      ticks: 0,
      /** Pointer travel gathered since the last tick, in uv */
      pending: { active: false, ax: 0, ay: 0, bx: 0, by: 0 },
    };
  }, []);

  useEffect(
    () => () => {
      for (const target of [...(sim.velocity ?? []), ...(sim.dye ?? [])]) target.dispose();
      for (const pass of [sim.velocityPass, sim.dyePass, sim.displayPass, sim.resamplePass]) pass.dispose();
      sim.quad.geometry.dispose();
    },
    [sim],
  );

  useEffect(() => {
    sim.dyePass.uniforms.fluidColor.value.set(fluidColor.r, fluidColor.g, fluidColor.b);
  }, [sim, fluidColor]);

  // Pointer: moves gather into one stroke per tick, so every tick the pointer moved in stirs,
  // however input events and frames line up, and its strength follows the distance per tick
  useEffect(() => {
    if (!interactive) return;
    const pending = sim.pending;
    const last = { valid: false, u: 0, v: 0, t: 0 };

    const onMove = (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const u = (e.clientX - rect.left) / rect.width;
      const v = 1 - (e.clientY - rect.top) / rect.height;
      if (last.valid && e.timeStamp - last.t <= STROKE_GAP_MS) {
        const jump = Math.hypot((u - last.u) * rect.width, (v - last.v) * rect.height);
        if (jump <= STROKE_MAX_JUMP * Math.max(rect.width, rect.height)) {
          if (!pending.active) {
            pending.active = true;
            pending.ax = last.u;
            pending.ay = last.v;
          }
          pending.bx = u;
          pending.by = v;
        }
      }
      last.valid = true;
      last.u = u;
      last.v = v;
      last.t = e.timeStamp;
    };
    // A lifted finger, a cancelled touch or a pointer leaving the window ends the stroke
    const onEnd = (e: PointerEvent) => {
      if (e.type === 'pointerout' ? !e.relatedTarget : e.pointerType !== 'mouse') last.valid = false;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onEnd, { passive: true });
    window.addEventListener('pointercancel', onEnd, { passive: true });
    window.addEventListener('pointerout', onEnd, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onEnd);
      window.removeEventListener('pointercancel', onEnd);
      window.removeEventListener('pointerout', onEnd);
      pending.active = false;
    };
  }, [gl, sim, interactive]);

  // Resuming starts from the present: no replayed backlog, no stroke gathered while paused
  useEffect(() => {
    if (!running) return;
    sim.accumulator = 0;
    sim.pending.active = false;
  }, [running, sim]);

  const draw = (material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) => {
    sim.quad.material = material;
    gl.setRenderTarget(target);
    gl.render(sim.quad, sim.camera);
  };

  /** New targets for a new grid size, carrying the fluid over so a resize never wipes it */
  const rebuild = (gx: number, gy: number) => {
    const velocity = makePair(gx, gy);
    const dye = makePair(gx, gy);
    if (sim.velocity && sim.dye) {
      const { uniforms } = sim.resamplePass;
      uniforms.scale.value.set(gx / sim.grid.x, gy / sim.grid.y, 1, 1);
      uniforms.source.value = sim.velocity[0].texture;
      draw(sim.resamplePass, velocity[0]);
      uniforms.scale.value.set(1, 1, 1, 1);
      uniforms.source.value = sim.dye[0].texture;
      draw(sim.resamplePass, dye[0]);
      for (const target of [...sim.velocity, ...sim.dye]) target.dispose();
    }
    sim.velocity = velocity;
    sim.dye = dye;
    sim.grid.set(gx, gy);
  };

  /**
   * Takes the pointer travel gathered since the last tick: a splat at the latest position, as the
   * original did once per frame, with a drag from the whole travel in uv (x250, clamped to 8)
   */
  const updateStroke = () => {
    const p = sim.pending;
    if (!p.active) {
      sim.drag.set(0, 0);
      sim.dyePass.uniforms.ink.value = 0;
      return;
    }
    p.active = false;
    const dx = p.bx - p.ax;
    const dy = p.by - p.ay;
    sim.pointer.set(p.bx, p.by);
    sim.drag.set(THREE.MathUtils.clamp(dx * 250, -8, 8), THREE.MathUtils.clamp(dy * 250, -8, 8));
    sim.dyePass.uniforms.ink.value = 0.0008 * smoothstep(-0.5, 0.5, Math.hypot(dx, dy));
  };

  const tick = () => {
    const velocity = sim.velocity!;
    const dye = sim.dye!;
    sim.ticks++;
    updateStroke();

    for (let i = 0; i < SUBSTEPS; i++) {
      sim.velocityPass.uniforms.velocityField.value = velocity[0].texture;
      draw(sim.velocityPass, velocity[1]);
      velocity.reverse();
    }

    sim.dyePass.uniforms.velocityField.value = velocity[0].texture;
    sim.dyePass.uniforms.dyeField.value = dye[0].texture;
    sim.dyePass.uniforms.seed.value = (sim.ticks % 1000) + 0.5;
    draw(sim.dyePass, dye[1]);
    dye.reverse();
  };

  // Priority 1: this callback renders the frame itself, so R3F skips its own scene render
  useFrame((_, delta) => {
    const [gx, gy] = wantedGrid;
    if (gx !== sim.grid.x || gy !== sim.grid.y) rebuild(gx, gy);

    if (running) {
      sim.accumulator += delta;
      let ticks = 0;
      while (sim.accumulator >= TICK && ticks < MAX_TICKS_PER_FRAME) {
        tick();
        sim.accumulator -= TICK;
        ticks++;
      }
      if (sim.accumulator >= TICK) sim.accumulator %= TICK;
    }

    sim.displayPass.uniforms.dyeField.value = sim.dye![0].texture;
    draw(sim.displayPass, null);
  }, 1);

  return null;
};

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const useReducedMotion = () =>
  useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(reducedMotionQuery).matches, () => false);

/**
 * Whether the fluid should be moving: the tab is visible, the canvas is on screen, and someone
 * is using the window (focus, or a mouse or pen over it). Touch screens count as attended,
 * since they may misreport focus and have no hover to wake them.
 */
const useAnimating = (host: React.RefObject<HTMLElement>, enabled: boolean) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!enabled || !element) {
      setAnimating(false);
      return;
    }

    const touch = window.matchMedia('(pointer: coarse)').matches;
    let onScreen = true;
    let focused = touch || document.hasFocus();
    let hovered = false;
    let attended = focused;
    let idleTimer = 0;

    const update = () => setAnimating(onScreen && attended && document.visibilityState === 'visible');

    // Waking is instant; holding still waits out the grace period
    const updateAttention = () => {
      window.clearTimeout(idleTimer);
      if (focused || hovered) {
        attended = true;
        update();
      } else if (attended) {
        idleTimer = window.setTimeout(() => {
          attended = false;
          update();
        }, IDLE_GRACE_MS);
      }
    };

    const onFocus = () => {
      focused = true;
      updateAttention();
    };
    const onBlur = () => {
      focused = false;
      updateAttention();
    };
    const onPointerOver = (e: PointerEvent) => {
      if (hovered || e.pointerType === 'touch') return;
      hovered = true;
      updateAttention();
    };
    // No relatedTarget: the pointer left the window
    const onPointerOut = (e: PointerEvent) => {
      if (!hovered || e.relatedTarget || e.pointerType === 'touch') return;
      hovered = false;
      updateAttention();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && !focused) onFocus();
    };

    const visibility = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      update();
    });
    visibility.observe(element);

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    // A move counts as hovering too, as in a window opened under a resting pointer
    window.addEventListener('pointermove', onPointerOver, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    window.addEventListener('pointerout', onPointerOut, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('visibilitychange', update);
    update();

    return () => {
      window.clearTimeout(idleTimer);
      visibility.disconnect();
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('pointermove', onPointerOver);
      window.removeEventListener('pointerover', onPointerOver);
      window.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', update);
    };
  }, [host, enabled]);

  return animating;
};

const FluidSimulation: React.FC = () => {
  const [color, setColor] = useState('#cc1a1a');
  const fluidColor = useMemo(() => new THREE.Color(color), [color]);
  const host = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const animating = useAnimating(host, !reducedMotion);

  return (
    <div ref={host} className="absolute inset-0">
      <Canvas
        // Reduced motion, a hidden tab or an unattended window keeps a still frame, redrawn only on resize
        frameloop={animating ? 'always' : 'demand'}
        dpr={PIXEL_RATIO}
        gl={{ antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' }}
        style={{ background: '#000000' }}
      >
        <FluidSimulationScene fluidColor={fluidColor} running={animating} interactive={!reducedMotion} />
      </Canvas>

      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-lg">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-10 sm:w-12 sm:h-10 rounded-lg cursor-pointer border-0 hover:opacity-80 transition-opacity"
        />
      </div>
    </div>
  );
};

export default FluidSimulation;
