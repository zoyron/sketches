import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeSketchHooks {
  update?: (now: number) => void; // runs every animation frame before rendering; now is the rAF timestamp in ms
  resize?: (width: number, height: number) => void; // runs after the renderer and a perspective camera have been resized
  dispose?: () => void; // frees what the hook can't see: controls, GUIs, window listeners, textures, render targets
}

// A sketch hands over its scene and camera, and may replace the plain render with its own (post-processing, multi-pass)
export type ThreeSketch = ThreeSketchHooks &
  (
    | { scene: THREE.Scene; camera: THREE.Camera; render?: () => void }
    | { scene?: undefined; camera?: undefined; render: () => void }
  );

export interface ThreeCanvasOptions extends THREE.WebGLRendererParameters {
  pixelRatio?: number; // defaults to the device's, capped at 2
}

const disposeObject = (object: THREE.Object3D) => {
  const { geometry, material } = object as THREE.Mesh;
  geometry?.dispose();
  (Array.isArray(material) ? material : [material]).forEach((m) => m?.dispose());
};

/**
 * Owns a full-window WebGLRenderer: creates and mounts it, runs the animation loop, follows window resizes and tears
 * everything down on unmount. `setup` builds the sketch once per mount, so it must not depend on later renders.
 * Attach the returned ref to the element the canvas should live in.
 */
export const useThreeCanvas = (
  setup: (renderer: THREE.WebGLRenderer) => ThreeSketch,
  { pixelRatio, ...rendererParameters }: ThreeCanvasOptions = {},
) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const getPixelRatio = () => pixelRatio ?? Math.min(window.devicePixelRatio, 2);

    const renderer = new THREE.WebGLRenderer(rendererParameters);
    renderer.setPixelRatio(getPixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const sketch = setup(renderer);
    const { scene, camera } = sketch;

    let animationFrameId = requestAnimationFrame(function animate(now) {
      animationFrameId = requestAnimationFrame(animate);
      sketch.update?.(now);
      if (sketch.render) sketch.render();
      else renderer.render(scene!, camera!);
    });

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setPixelRatio(getPixelRatio());
      renderer.setSize(width, height);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      sketch.resize?.(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      sketch.dispose?.();
      scene?.traverse(disposeObject);
      scene?.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      mount.removeChild(renderer.domElement);
    };
    // Like the plain effect it replaces, a sketch is built once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return mountRef;
};
