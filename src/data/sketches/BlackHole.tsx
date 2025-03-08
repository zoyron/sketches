import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const BlackHole: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Scene and camera setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // Mouse tracking
    const mouse = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX / window.innerWidth;
      mouse.y = 1.0 - event.clientY / window.innerHeight;
    };

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };

    // Shaders
    const fragmentShader = `
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;

      void main() {
          vec4 o = vec4(0.0);
          vec2 FC = gl_FragCoord.xy;
          vec2 r = resolution.xy;
          
          // Simple mouse influence
          float mouseEffect = 0.1;
          float distToMouse = length((FC/r - mouse) * 2.0);
          float mouseInfluence = smoothstep(0.5, 0.0, distToMouse) * mouseEffect;
          
          // Apply a small offset based on mouse position
          FC += (mouse - vec2(0.5)) * 100.0 * mouseInfluence;
          
          // Shader logic
          vec2 p = (FC.xy * 2.0 - r) / r.y / 0.7;
          vec2 d = vec2(-1.0, 1.0);
          vec2 c = p * mat2(1.0, 1.0, d / (0.1 + 5.0 / dot(5.0 * p - d, 5.0 * p - d)));
          vec2 v = c;
          
          v *= mat2(cos(log(length(v)) + time * 0.2 + vec4(0.0, 33.0, 11.0, 0.0))) * 5.0;
          
          for (float i = 1.0; i <= 9.0; i += 1.0) {
              o += sin(v.xyyx) + 1.0;
              v += 0.7 * sin(v.yx * i + time) / i + 0.5;
          }
          
          o = 1.0 - exp(-exp(c.x * vec4(0.6, -0.4, -1.0, 0.0)) / o / 
              (0.1 + 0.1 * pow(length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)) - 1.0, 2.0)) / 
              (1.0 + 7.0 * exp(0.3 * c.y - dot(c, c))) / 
              (0.03 + abs(length(p) - 0.7)) * 0.2);
          
          gl_FragColor = o;
      }
    `;

    const vertexShader = `
      void main() {
          gl_Position = vec4(position, 1.0);
      }
    `;

    // Uniforms
    const uniforms = {
      time: { value: 0 },
      resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      mouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    // Material and mesh setup
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation
    function animate() {
      uniforms.time.value += 0.01;
      uniforms.mouse.value.copy(mouse);
      renderer.render(scene, camera);
    }

    // Set up render loop
    let animationFrameId: number;
    const renderLoop = () => {
      animationFrameId = window.requestAnimationFrame(renderLoop);
      animate();
    };
    renderLoop();

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ backgroundColor: "black" }} />;
};

export default BlackHole;
