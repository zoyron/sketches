import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const Neurons: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const particleVertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const particleFragmentShader = `
      varying vec3 vColor;
      void main() {
          float r = length(gl_PointCoord - vec2(0.5, 0.5));
          if (r > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, r);
          gl_FragColor = vec4(vColor, alpha);
      }
    `;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    mountRef.current.appendChild(renderer.domElement);

    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const geometry = new THREE.BufferGeometry();
    const maxDistance = 6;

    const colorPalette = [
      [1, 0.7, 0.7],
      [0.7, 0.7, 1],
      [1, 1, 0.7],
      [0.7, 1, 0.7],
      [1, 0.7, 1],
      [0.7, 1, 1],
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color[0];
      colors[i3 + 1] = color[1];
      colors[i3 + 2] = color[2];

      sizes[i] = 0.5 + Math.random() * 0.5;

      velocities[i3] = (Math.random() - 0.5) * 0.06;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.06;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.06;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      vertexColors: true,
      transparent: true,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    const maxConnections = particleCount * 2;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();

    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3),
    );
    lineGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3),
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);

    camera.position.z = 61;

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;


    const animate = () => {
      requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array;
      let lineIndex = 0;

      scene.rotation.y += 0.00075;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        for (let j = 0; j < 3; j++) {
          if (Math.abs(positions[i3 + j]) > 25) {
            velocities[i3 + j] *= -0.8;
          }
        }
      }

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;

          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < maxDistance && lineIndex < maxConnections * 6) {
            linePositions[lineIndex] = positions[i3];
            linePositions[lineIndex + 1] = positions[i3 + 1];
            linePositions[lineIndex + 2] = positions[i3 + 2];
            linePositions[lineIndex + 3] = positions[j3];
            linePositions[lineIndex + 4] = positions[j3 + 1];
            linePositions[lineIndex + 5] = positions[j3 + 2];

            for (let k = 0; k < 6; k++) {
              lineColors[lineIndex + k] = 0.8;
            }

            lineIndex += 6;
          }
        }
      }

      geometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      controls.update();
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Neurons;
