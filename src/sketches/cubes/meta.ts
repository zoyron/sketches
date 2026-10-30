import { SketchMeta } from "../../types/Sketch";
import InteractiveCubes from "./InteractiveCubes";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 40,
  title: "Interactive Cubes",
  thumbnailURL: thumbnail,
  component: InteractiveCubes,
  description: "A responsive 3D cube field that reacts to mouse movements with smooth transformations.",
  technologies: ["Three.js", "React Three Fiber", "lil-gui"],
};

export default meta;
