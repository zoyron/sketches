import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

const SparklingSphere: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    mountRef.current.appendChild(renderer.domElement);

    // Camera position and controls
    camera.position.z = 5;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Post-processing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.1,
    );
    composer.addPass(bloomPass);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x88ccff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Group for all particles
    const group = new THREE.Group();
    scene.add(group);

    // Mouse tracking with raycaster
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    // Interactive parameters
    const interactionRadius = 1.5;
    const maxGlowIntensity = 5;
    const baseGlowIntensity = 0.5;
    const dispersalForce = 0.08;
    const returnForce = 0.02;
    const dampingFactor = 0.95;
    const rotationSpeed = 0.0025;

    // Create particles
    const createParticles = () => {
      const particles = [];
      const count = 2500;
      const radius = 2;

      const geometry = new THREE.SphereGeometry(0.015, 6, 6);

      const colors = [0x88ccff, 0x7dabf1, 0x6a8dff];

      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const position = new THREE.Vector3(x, y, z);

        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshStandardMaterial({
          color: baseColor,
          emissive: baseColor,
          emissiveMap: null,
          metalness: 0.5,
          roughness: 0.2,
          toneMapped: false,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);

        group.add(mesh);

        particles.push({
          mesh,
          position: position.clone(),
          originalPosition: position.clone(),
          velocity: new THREE.Vector3(),
          quaternion: new THREE.Quaternion(),
          baseColor: new THREE.Color(baseColor),
          currentIntensity: baseGlowIntensity,
        });
      }

      return particles;
    };

    const particles = createParticles();

    // Update particles function
    const updateParticles = () => {
      raycaster.setFromCamera(mousePos, camera);
      const intersectPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const mousePosition3D = new THREE.Vector3();
      raycaster.ray.intersectPlane(intersectPlane, mousePosition3D);

      particles.forEach((particle) => {
        const distanceToMouse = mousePosition3D.distanceTo(particle.position);
        const isInRange = distanceToMouse < interactionRadius;

        const force = isInRange
          ? dispersalForce * (1 - distanceToMouse / interactionRadius)
          : 0;

        if (isInRange) {
          const repulsionDir = particle.position
            .clone()
            .sub(mousePosition3D)
            .normalize();

          particle.velocity.add(
            repulsionDir.multiplyScalar(force * (1 + Math.random() * 0.2)),
          );

          const intensity = THREE.MathUtils.lerp(
            maxGlowIntensity,
            baseGlowIntensity,
            distanceToMouse / interactionRadius,
          );

          const glowColor = particle.baseColor
            .clone()
            .multiplyScalar(intensity);
          particle.mesh.material.emissive = glowColor;
        } else {
          particle.mesh.material.emissive = particle.baseColor
            .clone()
            .multiplyScalar(baseGlowIntensity);
        }

        const distanceToOrigin = particle.position.distanceTo(
          particle.originalPosition,
        );
        const returnForceVector = particle.originalPosition
          .clone()
          .sub(particle.position)
          .normalize()
          .multiplyScalar(returnForce * distanceToOrigin);

        particle.velocity.add(returnForceVector);
        particle.velocity.multiplyScalar(dampingFactor);

        particle.position.add(particle.velocity);
        particle.mesh.position.copy(particle.position);

        if (particle.velocity.length() > 0.001) {
          particle.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            particle.velocity.clone().normalize(),
          );
          particle.mesh.quaternion.slerp(particle.quaternion, 0.1);
        }
      });

      group.rotation.y += rotationSpeed;
    };

    // Window resize handler
    const handleWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      updateParticles();
      controls.update();
      composer.render();
    };

    // Add event listeners
    window.addEventListener("resize", handleWindowResize);
    window.addEventListener("mousemove", handleMouseMove);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("mousemove", handleMouseMove);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default SparklingSphere;
