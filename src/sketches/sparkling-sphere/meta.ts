import { SketchMeta } from "../../types/Sketch";
import SparklingSphere from "./SparklingSphere";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 60,
  title: "Sparkling Sphere",
  thumbnailURL: thumbnail,
  component: SparklingSphere,
  description: "A luminous sphere composed of thousands of sparkling particles with dynamic lighting effects.",
  technologies: ["Three.js", "GLSL", "Particle Systems"],
};

export default meta;
