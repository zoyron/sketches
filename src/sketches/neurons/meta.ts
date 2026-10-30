import { SketchMeta } from "../../types/Sketch";
import Neurons from "./Neurons";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 70,
  title: "Neurons",
  thumbnailURL: thumbnail,
  component: Neurons,
  description: "A neural network visualization with pulsing nodes and electric connections simulating brain activity.",
  technologies: ["Three.js", "React Three Fiber", "GLSL"],
};

export default meta;
