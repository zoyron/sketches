import { Sketch } from "../types/Sketch";
import Galaxy from "./sketches/galaxy/Galaxy";
import RotatingSphere from "./sketches/RotatingSphere";
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
    id: "cubes",
    title: "Interactive Cubes",
    author: "Sagar",
    thumbnailURL: "/sidebar/interactiveCubes.png",
    component: InteractiveCubes,
  },
  {
    id: "blobby-earth",
    title: "Blobby Earth",
    author: "Sagar",
    thumbnailURL: "/sidebar/interactiveCubes.png",
    component: EarthSphere,
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
  {
    id: "icosahedron",
    title: "Icosahedron",
    author: "Sarlloc",
    thumbnailURL: "/sidebar/sphere.png",
    component: RotatingSphere,
  },
];

export default sketches;
