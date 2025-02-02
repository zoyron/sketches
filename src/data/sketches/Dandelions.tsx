import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Sizes {
  width: number;
  height: number;
}

const DandelionScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x120712);

    // Sizes
    const sizes: Sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.z = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Shader materials
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vDistance;
        uniform float time;

        void main() {
            vColor = customColor;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            float wave = sin(position.x * 0.1 + time) * cos(position.z * 0.1 + time) * 0.1;
            mvPosition.xyz += wave * normalize(position);
            
            gl_PointSize = size * (200.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            vDistance = length(position) / 15.0;
            vAlpha = size / 15.0;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vDistance;
        uniform float time;

        void main() {
            vec2 xy = gl_PointCoord.xy - vec2(0.5);
            float r = length(xy);
            if (r > 0.5) discard;
            
            float pulseSpeed = 2.0;
            float pulseIntensity = sin(time * pulseSpeed) * 0.03 + 0.8;
            float glow = exp(-r * (2.5 + sin(time + vDistance * 5.0)));
            
            float sparkle = pow(glow, 1.5) * (sin(time * 5.0 + vDistance * 10.0) * 0.5 + 0.5);
            vec3 finalColor = vColor + sparkle * 0.2;
            
            gl_FragColor = vec4(finalColor, vAlpha * glow * pulseIntensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    });

    const stemMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying float vDistance;
        uniform float time;
        
        void main() {
            vDistance = position.y;
            vec3 pos = position;
            float wave = sin(time * 0.5 + position.y * 0.3) * 0.5;
            pos.x += wave;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vDistance;
        uniform float time;
        
        void main() {
            vec3 color = vec3(0.25, 0.6, 0.35);
            float glow = sin(time * 2.0 + vDistance * 5.0) * 0.1 + 0.9;
            gl_FragColor = vec4(color * glow, 1.0);
        }
      `,
    });

    // Create stem
    const createStem = () => {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, -35, 0),
        new THREE.Vector3(-8, -20, 0),
        new THREE.Vector3(-3, 0, 0),
        new THREE.Vector3(0, 0, 0)
      );

      const thickness = 0.2;
      const segments = 8;
      const thickGeometry = new THREE.TubeGeometry(
        curve,
        50,
        thickness,
        segments,
        false
      );
      const stem = new THREE.Mesh(thickGeometry, stemMaterial);
      scene.add(stem);
      return stem;
    };

    // Create particles
    const particleCount = 45000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const originalPositions: number[] = [];

    // Create dandelion shape
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const r = 15 * Math.pow(Math.random(), 0.5);

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions.push(x, y, z);

      const distanceFromCenter = Math.sqrt(x * x + y * y + z * z) / 15;
      colors[i * 3] = 0.75 - distanceFromCenter * 0.1;
      colors[i * 3 + 1] = 0.2 + distanceFromCenter * 0.1;
      colors[i * 3 + 2] = 0.35 + distanceFromCenter * 0.1;

      particleSizes[i] = 1 + Math.random() * 3;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("customColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));

    const particles = new THREE.Points(geometry, particleMaterial);
    createStem();
    scene.add(particles);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = false;

    // Animation
    let isScattering = false;
    const clock = new THREE.Clock();
    const velocities = Array(particleCount * 3)
      .fill(0)
      .map(() => (Math.random() - 0.5) * 2);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      const time = clock.getElapsedTime();
      particleMaterial.uniforms.time.value = time;
      stemMaterial.uniforms.time.value = time;

      const positions = particles.geometry.attributes.position
        .array as Float32Array;

      if (isScattering) {
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * 0.5;
          positions[i + 1] += velocities[i + 1] * 0.5;
          positions[i + 2] += velocities[i + 2] * 0.5;
        }
      } else {
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] =
            originalPositions[i] + Math.sin(time + positions[i] * 0.1) * 0.1;
          positions[i + 1] =
            originalPositions[i + 1] +
            Math.cos(time + positions[i + 1] * 0.1) * 0.1;
          positions[i + 2] =
            originalPositions[i + 2] +
            Math.sin(time + positions[i + 2] * 0.1) * 0.1;
        }
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;

      mouse.x = (clientX / sizes.width) * 2 - 1;
      mouse.y = -(clientY / sizes.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(particles);
      if (intersects.length > 0) {
        isScattering = true;
      }
    };

    // Event listeners
    window.addEventListener("mousedown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

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
      window.removeEventListener("mousedown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      particleMaterial.dispose();
      stemMaterial.dispose();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mountRef} />
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255, 255, 255, 0.5)",
          fontFamily: "sans-serif",
          fontSize: "0.9rem",
          letterSpacing: "0.2em",
          pointerEvents: "none",
          textTransform: "uppercase",
        }}
      >
        touch me
      </div>
    </div>
  );
};

export default DandelionScene;
