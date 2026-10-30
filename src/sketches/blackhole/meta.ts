import { SketchMeta } from "../../types/Sketch";
import BlackHole from "./BlackHole";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 100,
  title: "Black hole",
  author: "@XorDev on twitter",
  thumbnailURL: thumbnail,
  component: BlackHole,
  description: "A mesmerizing simulation of gravitational forces and light bending around a black hole's event horizon.",
  technologies: ["Three.js", "GLSL", "React Three Fiber"],
};

export default meta;
