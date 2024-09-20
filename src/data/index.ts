import { Sketch } from "../types/Sketch";
import RotatingCube from "./sketches/RotatingCube";
import RotatingSphere from "./sketches/RotatingSphere";
import RotatingTorus from "./sketches/RotatingRing";
import SparklingParticles from "./sketches/SparklingParticles";

const sketches: Sketch[] = [
  {
    id: "1",
    title: "Rotating Cube",
    author: "Sagar",
    thumbnailURL: "/sidebar/cube.png",
    component: RotatingCube,
  },
  {
    id: "2",
    title: "Rotating Sphere",
    author: "Sarlloc",
    thumbnailURL: "/sidebar/sphere.png",
    component: RotatingSphere,
  },
  {
    id: "3",
    title: "Rotating Torus",
    author: "Sagar Arora",
    thumbnailURL: "/sidebar/torus.png",
    component: RotatingTorus,
  },
  {
    id: "4",
    title: " Sparkling Particles",
    author: "Sagar",
    thumbnailURL: "/sidebar/particles.png",
    component: SparklingParticles,
  },
];

export default sketches;
