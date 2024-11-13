import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const InteractiveCubes: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    let cubes: THREE.Mesh[] = [];
    const cursor = new THREE.Vector3();
    const oPos = new THREE.Vector3();
    const vec = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const gap = 0.1;
    const stride = 5;
    const displacement = 3;
    const intensity = 1;

    // Scene setup
    const scene = new THREE.Scene();

    // Sizes
    const sizes = {
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
    camera.position.set(5, 5, 5);
    scene.add(camera);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(-10, 20, 20);
    spotLight.angle = 0.15;
    spotLight.penumbra = 1;
    spotLight.decay = 0;
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Create cubes
    const geometry = new RoundedBoxGeometry(1, 1, 1, 2, 0.15);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const center = stride / 2;

    for (let x = 0; x < stride; x++) {
      for (let y = 0; y < stride; y++) {
        for (let z = 0; z < stride; z++) {
          const cube = new THREE.Mesh(geometry, material.clone());
          const position = new THREE.Vector3(
            x + x * gap - center,
            y + y * gap - center,
            z + z * gap - center
          );
          cube.position.copy(position);
          cube.userData.originalPosition = position.clone();
          cube.userData.material = cube.material;
          cube.castShadow = true;
          cube.receiveShadow = true;
          scene.add(cube);
          cubes.push(cube);
        }
      }
    }

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / sizes.width) * 2 - 1;
      mouse.y = -(event.clientY / sizes.height) * 2 + 1;
      cursor.set(mouse.x, mouse.y, 0.5).unproject(camera);
      dir.copy(cursor).sub(camera.position).normalize();
      cursor.add(dir.multiplyScalar(camera.position.length()));
    };

    window.addEventListener("mousemove", handleMouseMove);

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

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      cubes.forEach((cube) => {
        oPos.copy(cube.userData.originalPosition);
        dir.copy(oPos).sub(cursor).normalize();
        const dist = oPos.distanceTo(cursor);
        const distInv = displacement - dist;
        const col = Math.max(0.5, distInv) / 1.5;

        if (dist > displacement * 1.1) {
          cube.userData.material.color.setRGB(1, 1, 1);
        } else {
          cube.userData.material.color.setRGB(col / 2, col * 2, col * 4);
        }

        if (dist > displacement) {
          cube.position.lerp(oPos, 0.2);
        } else {
          vec.copy(oPos).add(dir.multiplyScalar(distInv * intensity));
          cube.position.lerp(vec, 0.2);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default InteractiveCubes;
