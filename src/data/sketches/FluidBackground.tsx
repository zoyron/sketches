import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import * as THREE from 'three';

const FluidSimulation = () => {
  const { gl, viewport } = useThree();

  // Create render targets for ping-pong (balanced resolution for performance)
  const velocityFBOs = useRef([
    useFBO(384, 384, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.FloatType,
    }),
    useFBO(384, 384, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.FloatType,
    })
  ]);

  const dyeFBOs = useRef([
    useFBO(384, 384, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    }),
    useFBO(384, 384, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })
  ]);

  const velocityIndex = useRef(0);
  const dyeIndex = useRef(0);

  const pointer = useRef(new THREE.Vector4(0.5, 0.5, 0, 0));
  const prevPointer = useRef(new THREE.Vector4(0.5, 0.5, 0, 0));
  const isMouseDown = useRef(false);

  // Fluid solver shader
  const fluidMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        velocityField: { value: null },
        resolution: { value: new THREE.Vector2(384, 384) },
        mouse: { value: new THREE.Vector4() },
        prevMouse: { value: new THREE.Vector4() },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D velocityField;
        uniform vec2 resolution;
        uniform vec4 mouse;
        uniform vec4 prevMouse;
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

          vec2 extForce = vec2(0.0);

          if (mouse.z > 0.5 && prevMouse.z > 0.5) {
            vec2 dragDir = clamp((mouse.xy - prevMouse.xy) * 250.0, -8.0, 8.0);
            vec2 p = uv - mouse.xy;
            extForce.xy += 0.0008 / dot(p, p) * dragDir;
          }

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
      `,
    });
  }, []);

  // Dye advection shader
  const dyeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        velocityField: { value: null },
        dyeField: { value: null },
        resolution: { value: new THREE.Vector2(384, 384) },
        mouse: { value: new THREE.Vector4() },
        prevMouse: { value: new THREE.Vector4() },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D velocityField;
        uniform sampler2D dyeField;
        uniform vec2 resolution;
        uniform vec4 mouse;
        uniform vec4 prevMouse;
        varying vec2 vUv;

        float hash(float n) { return fract(sin(n) * 43758.5453123); }

        void main() {
          vec2 uv = vUv;
          vec2 stepSize = 1.0 / resolution;
          vec4 vel = texture2D(velocityField, uv);
          vec4 col = texture2D(dyeField, uv - 0.1 * vel.xy * stepSize * 2.0);

          if (mouse.z > 0.5 && prevMouse.z > 0.5) {
            float h = hash(mouse.z + mouse.w);
            vec3 rgb = vec3(0.2 + h * 0.2, 0.2 + h * 0.15, 0.2 + h * 0.15);
            float bloom = smoothstep(-0.5, 0.5, length(mouse.xy - prevMouse.xy));
            col.rgb += bloom * 0.0008 / pow(length(uv - mouse.xy), 1.6) * rgb;
          }

          col = clamp(col, 0.0, 5.0);
          col = max(col - col * 0.01, 0.0);

          gl_FragColor = col;
        }
      `,
    });
  }, []);

  // Display shader
  const displayMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dyeField: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dyeField;
        varying vec2 vUv;

        void main() {
          vec4 col = texture2D(dyeField, vUv);
          vec3 tonemapped = sqrt(col.rgb);
          tonemapped = tonemapped / (1.0 + tonemapped * 0.35);
          gl_FragColor = vec4(tonemapped, 1.0);
        }
      `,
    });
  }, []);

  const meshRef = useRef<THREE.Mesh>(null);
  
  const camera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const quad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), []);

  // Handle mouse/touch events
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - e.clientY / window.innerHeight;
      pointer.current.set(x, y, isMouseDown.current ? 1 : 0, e.timeStamp);
    };

    const handlePointerDown = () => {
      isMouseDown.current = true;
    };

    const handlePointerUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useFrame(() => {
    // Always update when mouse is moving
    const isMoving = Math.abs(pointer.current.x - prevPointer.current.x) > 0.001 ||
                     Math.abs(pointer.current.y - prevPointer.current.y) > 0.001;

    if (isMoving) {
      pointer.current.z = 1;
    }

    // Update velocity field (reduced to 2 passes for performance)
    for (let i = 0; i < 2; i++) {
      const readVelocity = velocityFBOs.current[velocityIndex.current];
      const writeVelocity = velocityFBOs.current[(velocityIndex.current + 1) % 2];

      fluidMaterial.uniforms.velocityField.value = readVelocity.texture;
      fluidMaterial.uniforms.mouse.value.copy(pointer.current);
      fluidMaterial.uniforms.prevMouse.value.copy(prevPointer.current);
      quad.material = fluidMaterial;
      gl.setRenderTarget(writeVelocity);
      gl.render(quad, camera);

      velocityIndex.current = (velocityIndex.current + 1) % 2;
    }

    // Update dye field
    const readDye = dyeFBOs.current[dyeIndex.current];
    const writeDye = dyeFBOs.current[(dyeIndex.current + 1) % 2];
    const currentVelocity = velocityFBOs.current[velocityIndex.current];

    dyeMaterial.uniforms.velocityField.value = currentVelocity.texture;
    dyeMaterial.uniforms.dyeField.value = readDye.texture;
    dyeMaterial.uniforms.mouse.value.copy(pointer.current);
    dyeMaterial.uniforms.prevMouse.value.copy(prevPointer.current);
    quad.material = dyeMaterial;
    gl.setRenderTarget(writeDye);
    gl.render(quad, camera);

    dyeIndex.current = (dyeIndex.current + 1) % 2;

    // Update display
    if (meshRef.current) {
      const currentDye = dyeFBOs.current[dyeIndex.current];
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.dyeField.value = currentDye.texture;
    }

    prevPointer.current.copy(pointer.current);
    if (isMoving) {
      pointer.current.z = 0;
    }

    gl.setRenderTarget(null);
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]} material={displayMaterial}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ background: '#000000' }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <FluidSimulation />
      </Canvas>
    </div>
  );
};

export default FluidBackground;
