import { lazySketch } from "../lib/lazySketch";
import { Sketch, SketchMeta } from "../types/Sketch";

const REPOSITORY_URL = "https://github.com/zoyron/sketches";
const DEFAULT_AUTHOR = "Sagar";

// Every folder here with a meta.ts is a sketch, and its name is the sketch's URL id
const metas = import.meta.glob<SketchMeta>("./*/meta.ts", { eager: true, import: "default" });

const sketches: Sketch[] = Object.entries(metas)
  .map(([path, meta]) => {
    const id = path.split("/")[1];
    return {
      ...meta,
      id,
      author: meta.author ?? DEFAULT_AUTHOR,
      component: lazySketch(meta.load),
      sourceCodeUrl: `${REPOSITORY_URL}/tree/main/src/sketches/${id}`,
    };
  })
  .sort((a, b) => b.order - a.order);

export default sketches;
