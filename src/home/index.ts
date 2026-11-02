import { lazySketch } from "../lib/lazySketch";
import { Sketch } from "../types/Sketch";

// Homepage is separate - not part of the sketches collection.
// Lazy like a sketch: its fluid background pulls in three.js and React Three Fiber, and a link straight to a sketch
// shouldn't have to download those. The landing page itself shows the loader for a moment instead of a blank screen.
const homepage: Sketch = {
  id: "homepage",
  title: "Welcome",
  author: "Sagar",
  thumbnailURL: "/sidebar/welcome.png",
  component: lazySketch(() => import("./HomePage")),
  description: "A welcoming gateway to the Digital Atelier, showcasing the collection of WebGL experiments.",
  technologies: ["React", "Three.js", "React Three Fiber"],
};

export default homepage;
