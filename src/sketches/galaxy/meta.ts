import { SketchMeta } from "../../types/Sketch";
import Galaxy from "./Galaxy";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 20,
  title: "Galaxy",
  thumbnailURL: thumbnail,
  component: Galaxy,
  description: "A procedurally generated spiral galaxy with millions of stars and cosmic dust effects.",
  technologies: ["Three.js", "GLSL", "Procedural Generation"],
};

export default meta;
