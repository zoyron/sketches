import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 20,
  title: "Galaxy",
  thumbnailURL: thumbnail,
  load: () => import("./Galaxy"),
  description: "A procedurally generated spiral galaxy with millions of stars and cosmic dust effects.",
  technologies: ["Three.js", "GLSL", "Procedural Generation"],
};

export default meta;
