import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  return (
    <div>
      <h2>{sketch.title}</h2>
      <p>sketch id is: {sketch.id}</p>
    </div>
  );
};

export default SketchViewer;
