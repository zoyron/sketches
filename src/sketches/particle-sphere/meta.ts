import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 50,
  title: "Particle Sphere",
  thumbnailURL: thumbnail,
  load: () => import("./ParticleSphere"),
  description: "An interactive particle system forming a sphere with fluid motion and gravitational attraction.",
  technologies: ["Three.js", "React Three Fiber", "GLSL"],
};

export default meta;
