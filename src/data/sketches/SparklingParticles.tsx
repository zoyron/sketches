import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { getOptimalParticleCount } from "../../utils/deviceLOD";

const MAX_PARTICLES = 50000;

const Particles = ({ count = getOptimalParticleCount(MAX_PARTICLES) }) => {
  const mesh = useRef<THREE.Points>(null!);
  const light = useRef<THREE.PointLight>(null!);

  // Store original positions and create shader material
  const { positions, originalPositions, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const originalX = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      originalX[i] = positions[i3]; // Store for shader
    }

    // Shader material for GPU-based animation
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 0.02 * Math.min(window.devicePixelRatio, 2) * 100 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        attribute float originalX;

        void main() {
          vec3 pos = position;

          // Animate Y position based on time and original X
          pos.y = sin(uTime + originalX) * 0.4 + cos(uTime + originalX) * 0.4;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uSize * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        void main() {
          // Circular particle shape
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;

          // Soft edges
          float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
          gl_FragColor = vec4(0.0, 0.5, 0.98, 0.8 * alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    return { positions, originalPositions: originalX, material };
  }, [count]);

  // Update shader time uniform (GPU does the rest!)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current && mesh.current.material) {
      (mesh.current.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    }
    light.current.position.set(
      Math.sin(time * 0.2) * 3,
      Math.cos(time * 0.4) * 3,
      Math.cos(time * 0.3) * 3
    );
  });

  // Cleanup
  useEffect(() => {
    return () => {
      if (mesh.current) {
        mesh.current.geometry?.dispose();
        (mesh.current.material as THREE.ShaderMaterial)?.dispose();
      }
    };
  }, []);

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="white" />
      <points ref={mesh} material={material}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-originalX"
            count={originalPositions.length}
            array={originalPositions}
            itemSize={1}
          />
        </bufferGeometry>
      </points>
    </>
  );
};

const SparklingParticles: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 5, 5] }}>
      <color attach="background" args={["black"]} />
      <Particles />
      <OrbitControls />
    </Canvas>
  );
};

export default SparklingParticles;
