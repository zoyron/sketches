import { Sketch } from "../types/Sketch";
import Galaxy from "./sketches/galaxy/Galaxy";
import RotatingCube from "./sketches/RotatingCube";
import RotatingSphere from "./sketches/RotatingSphere";
import RotatingTorus from "./sketches/RotatingRing";
import SparklingParticles from "./sketches/SparklingParticles";
import HomePage from "./sketches/HomePage";

const sketches: Sketch[] = [
  {
    id: "homepage",
    title: "Welcome",
    author: "Sagar",
    thumbnailURL: "/sidebar/welcome.png",
    component: HomePage,
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
  {
    id: "torus",
    title: "Wireframed Torus",
    author: "Sagar Arora",
    thumbnailURL: "/sidebar/torus.png",
    component: RotatingTorus,
  },
  {
    id: "rotating-cube",
    title: "Rotating Cube",
    author: "Sagar",
    thumbnailURL: "/sidebar/cube.png",
    component: RotatingCube,
  },
];

export default sketches;
