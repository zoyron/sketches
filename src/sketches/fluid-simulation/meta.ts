import { SketchMeta } from "../../types/Sketch";
import FluidSimulation from "./FluidSimulation";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 110,
  title: "Fluid",
  thumbnailURL: thumbnail,
  component: FluidSimulation,
  description: "An interactive fluid dynamics simulation with realistic physics and customizable color trails.",
  technologies: ["Three.js", "GLSL", "React Three Fiber", "FBO"],
};

export default meta;
