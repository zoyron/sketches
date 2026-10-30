import { SketchMeta } from "../../types/Sketch";
import DandelionScene from "./Dandelions";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 90,
  title: "Dandelions",
  thumbnailURL: thumbnail,
  component: DandelionScene,
  description: "An ethereal field of dandelions with interactive wind physics and particle systems.",
  technologies: ["Three.js", "React Three Fiber", "GLSL"],
};

export default meta;
