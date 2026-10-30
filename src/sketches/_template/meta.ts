import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

// Copy this folder to start a new sketch: the folder name becomes its URL, and this copy stays out of the gallery
const meta: SketchMeta = {
  order: 0, // a new sketch takes the next number above the current highest, which lists it first
  title: "Template",
  thumbnailURL: thumbnail, // replace thumbnail.png with a screenshot of the sketch
  load: () => import("./Template"),
  description: "What this sketch is about.",
  technologies: ["Three.js"],
  // A pill in the corner of the sketch. Only give touch text if a finger really does something
  // hint: { mouse: "Move mouse to interact", touch: "Drag to interact" },
};

export default meta;
