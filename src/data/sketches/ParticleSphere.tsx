import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createNoise3D } from "simplex-noise";

const ParticleSphere: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const noise3D = createNoise3D();
    let particles: THREE.Points;
    const particleCount = 20000;
    const radius = 5;

    // Scene setup
    const scene = new THREE.Scene();

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000,
    );
    camera.position.set(5, 5, 8);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create particle system
    const createParticleSystem = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const r = radius * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        velocities[i3] = 0;
        velocities[i3 + 1] = 0;
        velocities[i3 + 2] = 0;
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      );
      geometry.setAttribute(
        "velocity",
        new THREE.BufferAttribute(velocities, 3),
      );

      const material = new THREE.PointsMaterial({
        size: 0.06,
        color: new THREE.Color(0x00ffff),
        transparent: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      // Add a slight blue glow effect
      material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          "vec4 diffuseColor = vec4( diffuse, opacity );",
          `
          vec4 diffuseColor = vec4( diffuse, opacity );
          float distanceToCenter = length(gl_PointCoord - 0.5);
          float strength = 1.0 - (distanceToCenter * 2.0);
          strength = pow(strength, 2.0);
          diffuseColor.rgb *= strength * 1.5;
          `,
        );
      };

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    createParticleSystem();

    // Create wireframe sphere
    const wireframeGeometry = new THREE.IcosahedronGeometry(radius, 16);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.075,
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.9;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 20;

    // Animation
    const animate = (time: number) => {
      requestAnimationFrame(animate);
      controls.update();

      // Add rotation to particles and wireframe
      particles.rotation.y += 0.001;
      particles.rotation.x -= 0.001;
      wireframe.rotation.y += 0.001;

      const positions = particles.geometry.attributes.position
        .array as Float32Array;
      const velocities = particles.geometry.attributes.velocity
        .array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Apply Perlin noise to velocity
        const noiseScale = 1;
        const timeScale = 0.5;
        const noise = noise3D(
          x * noiseScale + time * timeScale,
          y * noiseScale + time * timeScale,
          z * noiseScale + time * timeScale,
        );

        velocities[i3] += noise * 0.003;
        velocities[i3 + 1] += noise * 0.003;
        velocities[i3 + 2] += noise * 0.003;

        // Update positions
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Keep particles within sphere bounds
        const distance = Math.sqrt(x * x + y * y + z * z);
        if (distance > radius) {
          const scale = radius / distance;
          positions[i3] *= scale;
          positions[i3 + 1] *= scale;
          positions[i3 + 2] *= scale;

          // Dampen velocities when hitting boundary
          velocities[i3] *= 0.5;
          velocities[i3 + 1] *= 0.5;
          velocities[i3 + 2] *= 0.5;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate(0);

    // Resize handler
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ParticleSphere;
