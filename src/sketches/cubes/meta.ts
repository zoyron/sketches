import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 40,
  title: "Interactive Cubes",
  thumbnailURL: thumbnail,
  load: () => import("./InteractiveCubes"),
  hint: { mouse: "Move mouse to interact", touch: "Drag to interact" },
  description: "A responsive 3D cube field that reacts to mouse movements with smooth transformations.",
  technologies: ["Three.js", "React Three Fiber", "lil-gui"],
};

export default meta;
