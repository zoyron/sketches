import { Sketch } from "../types/Sketch";
import Galaxy from "./sketches/galaxy/Galaxy";
import SparklingParticles from "./sketches/SparklingParticles";
import HomePage from "./sketches/HomePage";
import InteractiveCubes from "./sketches/InteractiveCubes";
import EarthSphere from "./sketches/blobbyEarth/Earth";

const sketches: Sketch[] = [
  {
    id: "homepage",
    title: "Welcome",
    author: "Sagar",
    thumbnailURL: "/sidebar/welcome.png",
    component: HomePage,
  },
  {
    id: "blobby-earth",
    title: "Blobby Earth",
    author: "Sagar",
    thumbnailURL: "/sidebar/blobbyEarth.png",
    component: EarthSphere,
  },
  {
    id: "cubes",
    title: "Interactive Cubes",
    author: "Sagar",
    thumbnailURL: "/sidebar/interactiveCubes.png",
    component: InteractiveCubes,
  },
  {
    id: "galaxy",
    title: "Galaxy",
    author: "Sagar",
    thumbnailURL: "/sidebar/galaxy.png",
    component: Galaxy,
  },
  {
    id: "sparkling-particles",
    title: "Sparkling Particles",
    author: "Sagar",
    thumbnailURL: "/sidebar/particles.png",
    component: SparklingParticles,
  },
];

export default sketches;
