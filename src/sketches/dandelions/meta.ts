import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 90,
  title: "Dandelions",
  thumbnailURL: thumbnail,
  load: () => import("./Dandelions"),
  hint: { mouse: "Click to scatter", touch: "Tap to scatter" },
  description: "An ethereal field of dandelions with interactive wind physics and particle systems.",
  technologies: ["Three.js", "React Three Fiber", "GLSL"],
};

export default meta;
