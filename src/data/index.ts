import { Sketch } from "../types/Sketch";
import RotatingCube from "./sketches/RotatingCube";
import RotatingSphere from "./sketches/RotatingSphere";

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
];

export default sketches;
