import { SketchMeta } from "../../types/Sketch";
import EarthSphere from "./Earth";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 80,
  title: "Blobby Earth",
  thumbnailURL: thumbnail,
  component: EarthSphere,
  description: "A fluid, organic representation of Earth with morphing surface topology and atmospheric effects.",
  technologies: ["Three.js", "GLSL", "Simplex Noise"],
};

export default meta;
