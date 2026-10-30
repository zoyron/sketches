import { SketchMeta } from "../../types/Sketch";
import InteractiveEarth from "./InteractiveEarth";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 30,
  title: "Interactive Earth",
  thumbnailURL: thumbnail,
  component: InteractiveEarth,
  description: "A detailed Earth visualization with particle clouds, atmospheric glow, and interactive rotation.",
  technologies: ["Three.js", "GLSL", "Particle Systems"],
};

export default meta;
