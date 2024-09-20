import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const Particles = ({ count = 50000 }) => {
  const mesh = useRef<THREE.Points>(null!);
  const light = useRef<THREE.PointLight>(null!);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      temp[i3] = (Math.random() - 0.5) * 10;
      temp[i3 + 1] = (Math.random() - 0.5) * 10;
      temp[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      mesh.current.geometry.attributes.position.array[i3 + 1] =
        Math.sin(time + particles[i3]) * 0.4 +
        Math.cos(time + particles[i3]) * 0.4;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    light.current.position.set(
      Math.sin(time * 0.2) * 3,
      Math.cos(time * 0.4) * 3,
      Math.cos(time * 0.3) * 3
    );
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="white" />
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#0080fa"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
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
