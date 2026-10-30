import { SketchMeta } from "../../types/Sketch";
import SparklingParticles from "./SparklingParticles";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 10,
  title: "Sparkling Particles",
  thumbnailURL: thumbnail,
  component: SparklingParticles,
  description: "An ambient particle cloud with shimmering effects and smooth orbital motion patterns.",
  technologies: ["Three.js", "GLSL", "Particle Systems"],
};

export default meta;
