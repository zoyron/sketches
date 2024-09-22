import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
// import galaxyVertexShader from "./vertex.glsl";
// import galaxyFragmentShader from "./fragment.glsl";

// Import shaders as strings
const galaxyVertexShader = `
uniform float uTime;
uniform float uSize;
attribute float aScale;
attribute vec3 aRandom;
varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // spin
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float offSetAngle = (1.0 / distanceToCenter) * uTime * 0.25;
  angle += offSetAngle;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  // adding randomness to the galaxy
  modelPosition.xyz += aRandom;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // size of the particles
  gl_PointSize = uSize * aScale;
  
  // applying the particle attenuation formula
  gl_PointSize *= (1.0 / - viewPosition.z);

  // varying color
  vColor = color;
}

`;

const galaxyFragmentShader = `
varying vec3 vColor;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));

  // difused disc
  //strength *= 2.0;
  //strength = 1.0 - strength;

  // Light point using pow method
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  // final 
  vec3 color = mix(vec3(0.0), vColor, vec3(strength));

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}

`;

interface GalaxyParameters {
  count: number;
  size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  insideColor: string;
  outsideColor: string;
}

const Galaxy: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [parameters, setParameters] = useState<GalaxyParameters>({
    count: 50000,
    size: 0.005,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.5,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(3, 4.75, 3);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Galaxy
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let points: THREE.Points | null = null;

    const generateGalaxy = () => {
      if (points !== null) {
        geometry?.dispose();
        material?.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();

      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);
      const scales = new Float32Array(parameters.count);
      const randomness = new Float32Array(parameters.count * 3);

      const insideColor = new THREE.Color(parameters.insideColor);
      const outsideColor = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        const radius = Math.random() * parameters.radius;
        const branchAngle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        positions[i3] = Math.cos(branchAngle) * radius;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(branchAngle) * radius;

        const randomX =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomY =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;
        const randomZ =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1) *
          parameters.randomness *
          radius;

        randomness[i3] = randomX;
        randomness[i3 + 1] = randomY;
        randomness[i3 + 2] = randomZ;

        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;

        scales[i] = Math.random();
      }

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(randomness, 3)
      );

      material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        transparent: true,
        uniforms: {
          uSize: { value: 30 * renderer.getPixelRatio() },
          uTime: { value: 0 },
        },
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    generateGalaxy();

    // GUI
    const gui = new GUI();
    gui.add(parameters, "count", 100, 1000000, 100).onChange(generateGalaxy);
    gui.add(parameters, "radius", 0.01, 20, 0.01).onChange(generateGalaxy);
    gui.add(parameters, "branches", 2, 20, 1).onChange(generateGalaxy);
    gui.add(parameters, "randomness", 0, 2, 0.001).onChange(generateGalaxy);
    gui
      .add(parameters, "randomnessPower", 1, 10, 0.001)
      .onChange(generateGalaxy);
    gui.addColor(parameters, "insideColor").onChange(generateGalaxy);
    gui.addColor(parameters, "outsideColor").onChange(generateGalaxy);
    gui.close();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (material) {
        material.uniforms.uTime.value = elapsedTime;
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      gui.destroy();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry?.dispose();
      material?.dispose();
      renderer.dispose();
    };
  }, [parameters]);

  return <div ref={mountRef} />;
};

export default Galaxy;
