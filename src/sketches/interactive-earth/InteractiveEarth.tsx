import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import colorMap1 from "./earthbump1k.jpg";
import lightMap1 from "./earthrainbow1k.jpg";
import elevationMap1 from "./earthbump1k.jpg";
import alphaMap1 from "./earthspec1k.jpg";
import { useThreeCanvas } from "../../lib/useThreeCanvas";

const InteractiveEarth: React.FC = () => {
  const mountRef = useThreeCanvas((renderer) => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000000");

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(3, 3, 3);
    scene.add(camera);

    // Texture Loading
    const textureLoader = new THREE.TextureLoader();
    const colorMap = textureLoader.load(colorMap1);
    const lightMap = textureLoader.load(lightMap1);
    const elevationMap = textureLoader.load(elevationMap1);
    const alphaMap = textureLoader.load(alphaMap1);

    // Inner Wiring
    const radius = 2;
    const geo = new THREE.IcosahedronGeometry(radius, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00004b,
      wireframe: true,
      transparent: true,
      opacity: 0.0,
    });
    const innerWire = new THREE.Mesh(geo, mat);
    scene.add(innerWire);

    // Points Material (Earth)
    const vert = 125;
    const geometry = new THREE.IcosahedronGeometry(radius, vert);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColorMap: { value: colorMap },
        uLightMap: { value: lightMap },
        uElevationMap: { value: elevationMap },
        uAlphaMap: { value: alphaMap },
        uTime: { value: 0.0 },
        uSize: { value: 3.0 },
        uMouseUV: { value: new THREE.Vector2(0.0, 0.0) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    // Raycaster Setup
    const pointerPos = new THREE.Vector2();
    const sunUV = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const handleRaycast = () => {
      raycaster.setFromCamera(pointerPos, camera);
      const intersects = raycaster.intersectObjects([innerWire], false);
      if (intersects.length > 0 && intersects[0].uv) {
        sunUV.copy(intersects[0].uv);
      }
      material.uniforms.uMouseUV.value = sunUV;
    };

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Pointer move handler
    const handlePointerMove = (event: PointerEvent) => {
      if (!event.isPrimary) return;
      pointerPos.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
    };

    // Add event listeners
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerMove); // a tap has no move

    return {
      scene,
      camera,
      update() {
        mesh.rotation.y += 0.0025;
        innerWire.rotation.y += 0.0025;
        material.uniforms.uTime.value += 0.00025;
        handleRaycast();
        controls.update();
      },
      dispose() {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerdown", handlePointerMove);
        colorMap.dispose();
        lightMap.dispose();
        elevationMap.dispose();
        alphaMap.dispose();
        controls.dispose();
      },
    };
  }, { antialias: true });

  return <div ref={mountRef} />;
};

export default InteractiveEarth;
