import * as THREE from "three";
import { Sketch } from "../../types/Sketch";

const RotatingCube: Sketch = {
  id: "1",
  title: "Rotating Cube",
  author: "Sagar",
  thumbnailURL: "/sidebar/sparkles.png",
  sketchFunction: () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document
      .querySelector(".sketch-container")
      ?.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  },
};

export default RotatingCube;
