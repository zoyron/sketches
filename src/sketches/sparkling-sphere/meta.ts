import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 60,
  title: "Sparkling Sphere",
  thumbnailURL: thumbnail,
  load: () => import("./SparklingSphere"),
  hint: { mouse: "Move mouse to create glow", touch: "Drag to create glow" },
  description: "A luminous sphere composed of thousands of sparkling particles with dynamic lighting effects.",
  technologies: ["Three.js", "GLSL", "Particle Systems"],
};

export default meta;
