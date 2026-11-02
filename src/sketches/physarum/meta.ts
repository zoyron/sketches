import { SketchMeta } from "../../types/Sketch";
import thumbnail from "./thumbnail.png";

const meta: SketchMeta = {
  order: 120,
  title: "Physarum",
  thumbnailURL: thumbnail,
  load: () => import("./Physarum"),
  description: "A swarm of slime-mould agents, each following the scent its neighbours leave behind, weaving a living labyrinth that never stops rearranging itself. Move to lay food, click to send a ripple through the colony.",
  technologies: ["Three.js", "GLSL", "GPGPU", "Agent-based Simulation"],
};

export default meta;
