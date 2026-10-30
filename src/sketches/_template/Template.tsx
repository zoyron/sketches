import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useThreeCanvas } from "../../lib/useThreeCanvas";

const Template: React.FC = () => {
  const mountRef = useThreeCanvas((renderer) => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshNormalMaterial({ wireframe: true })
    );
    scene.add(mesh);

    return {
      scene,
      camera,
      update() {
        mesh.rotation.y += 0.005;
        controls.update();
      },
      // The scene's geometries and materials get disposed for you; this is for everything else
      dispose() {
        controls.dispose();
      },
    };
  }, { antialias: true });

  return <div ref={mountRef} />;
};

export default Template;
