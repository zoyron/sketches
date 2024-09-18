import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  return (
    <div style={{ flex: 1, padding: "20px" }}>
      <h2>{sketch.title}</h2>
      <p>sketch id is: {sketch.id}</p>
      <p>Created by {sketch.author}</p>
      <div
        style={{ width: "100%", height: "400px", backgroundColor: "#f0f0f0" }}
      >
        Sketch will be rendered here.
      </div>
    </div>
  );
};

export default SketchViewer;
