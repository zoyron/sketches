import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import earthmapTexture from "./earthmap1k.jpg";
import { useThreeCanvas } from "../../lib/useThreeCanvas";

const EarthSphere: React.FC = () => {
  const mountRef = useThreeCanvas((renderer) => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.x = 8;
    camera.position.y = 10;
    camera.position.z = 12;
    scene.add(camera);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const perlinTexture = textureLoader.load(earthmapTexture);

    // Mesh
    const geometry = new THREE.IcosahedronGeometry(2, 30);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      opacity: 0.025,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uPerlinTexture: new THREE.Uniform(perlinTexture),
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation
    const clock = new THREE.Clock();

    return {
      scene,
      camera,
      update() {
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsedTime;
        mesh.rotation.y += 0.0125;

        controls.update();
      },
      dispose() {
        perlinTexture.dispose();
        controls.dispose();
      },
    };
  }, { antialias: true });

  return <div ref={mountRef} />;
};

export default EarthSphere;
