import * as THREE from "three";
import { Sketch } from "../../types/Sketch";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const RotatingSphere: Sketch = {
  id: "2",
  title: "Rotating Sphere",
  author: "Sagar",
  thumbnailURL: "/sidebar/sphere.png",
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
    renderer.setPixelRatio(2);

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

    const geometry = new THREE.IcosahedronGeometry(2, 16);
    const material = new THREE.MeshNormalMaterial({ wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    // Handle window resize
    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(2);
    }

    function animate() {
      requestAnimationFrame(animate);

      // Update controls
      controls.update();

      // Rotate cube (optional, remove if you want to control rotation only with OrbitControls)
      sphere.rotation.y += 0.005;

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

export default RotatingSphere;
