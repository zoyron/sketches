import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 80,
  title: "Blobby Earth",
  thumbnailURL: thumbnail,
  load: () => import("./Earth"),
  description: "A fluid, organic representation of Earth with morphing surface topology and atmospheric effects.",
  technologies: ["Three.js", "GLSL", "Simplex Noise"],
};

export default meta;
