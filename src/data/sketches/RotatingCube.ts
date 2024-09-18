import * as THREE from "three";
import { Sketch } from "../../types/Sketch";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

    const container = document.querySelector(".sketch-container");
    if (container) {
      container.appendChild(renderer.domElement);
    } else {
      console.error("Sketch container not found");
      return;
    }

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Add smooth damping effect
    controls.dampingFactor = 0.05;

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Handle window resize
    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Rotate cube (optional, remove if you want to control rotation only with OrbitControls)
      cube.rotation.x += 0.005;
      cube.rotation.y += 0.005;

      renderer.render(scene, camera);
    }

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  },
};

export default RotatingCube;
