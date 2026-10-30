import { Sketch } from "../types/Sketch";
import HomePage from "./HomePage";

// Homepage is separate - not part of the sketches collection
const homepage: Sketch = {
  id: "homepage",
  title: "Welcome",
  author: "Sagar",
  thumbnailURL: "/sidebar/welcome.png",
  component: HomePage,
  description: "A welcoming gateway to the Digital Atelier, showcasing the collection of WebGL experiments.",
  technologies: ["React", "Three.js", "React Three Fiber"],
};

export default homepage;
