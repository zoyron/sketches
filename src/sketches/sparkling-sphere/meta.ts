import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 60,
  title: "Sparkling Sphere",
  thumbnailURL: thumbnail,
  load: () => import("./SparklingSphere"),
  description: "A luminous sphere composed of thousands of sparkling particles with dynamic lighting effects.",
  technologies: ["Three.js", "GLSL", "Particle Systems"],
};

export default meta;
