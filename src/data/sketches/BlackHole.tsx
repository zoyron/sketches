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
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const mouse = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (event: MouseEvent) => {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1.0 - event.clientY / window.innerHeight;
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
          
          // Fluidic mouse interaction
          float mouseEffect = 0.15;
          vec2 m = mouse;
          vec2 diff = (FC/r - m);
          float distToMouse = length(diff * 2.0);
          float mouseInfluence = smoothstep(0.8, 0.0, distToMouse) * mouseEffect;
          
          // Apply a rotational twist based on mouse proximity for a fluidic feel
          float angle = mouseInfluence * 1.5;
          float s = sin(angle), c_cos = cos(angle);
          mat2 rot = mat2(c_cos, -s, s, c_cos);
          
          FC -= m * r;
          FC *= rot;
          FC += m * r;
          
          // Apply a gentle offset based on mouse position
          FC += (m - vec2(0.5)) * 120.0 * mouseInfluence;
          
          // Original shader logic - preserving the beautiful math
          vec2 p = (FC.xy * 2.0 - r) / r.y / 0.7;
          vec2 d = vec2(-1.0, 1.0);
          vec2 c = p * mat2(1.0, 1.0, d / (0.1 + 5.0 / dot(5.0 * p - d, 5.0 * p - d)));
          vec2 v = c;
          
          v *= mat2(cos(log(length(v)) + time * 0.2 + vec4(0.0, 33.0, 11.0, 0.0))) * 5.0;
          
          for (float i = 1.0; i <= 9.0; i += 1.0) {
              o += sin(v.xyyx) + 1.0;
              v += 0.7 * sin(v.yx * i + time) / i + 0.5;
          }
          
          // Outer-spacy colors: Cosmic Purple / Blue / Cyan
          // Modified the original color vector (0.6, -0.4, -1.0, 0.0) -> (0.2, 0.1, 0.7, 0.0)
          vec4 spaceColor = vec4(0.2, 0.1, 0.7, 0.0);
          
          o = 1.0 - exp(-exp(c.x * spaceColor) / o / 
              (0.1 + 0.1 * pow(length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)) - 1.0, 2.0)) / 
              (1.0 + 7.0 * exp(0.3 * c.y - dot(c, c))) * 2.0);
          
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
      // Smoothly interpolate mouse position for fluidic interactivity
      mouse.lerp(targetMouse, 0.05);

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

    const currentMount = mountRef.current;

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);

      // Properly dispose of Three.js resources
      geometry.dispose();
      material.dispose();
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();

      if (currentMount && renderer.domElement.parentNode === currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ backgroundColor: "black" }} />
      <div className="absolute bottom-8 right-8 pointer-events-none">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/40 backdrop-blur-sm border border-white/10">
          <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="text-xs sm:text-sm font-medium text-white/70 tracking-wide">
            Move mouse to interact
          </span>
        </div>
      </div>
    </>
  );
};

export default BlackHole;
