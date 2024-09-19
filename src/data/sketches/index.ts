import { Sketch } from "../../types/Sketch";
import RotatingCube from "./RotatingCube";
import RotatingSphere from "./RotatingSphere";

// rotating cube is an object that we imported
// here we will be creating an array of objects
const sketches: Sketch[] = [RotatingCube, RotatingSphere];

export default sketches;

// sketches is an array of objects that we are exporting to imported in gallerypage
