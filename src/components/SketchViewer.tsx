import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const SketchComponent = sketch.component;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <SketchComponent />
    </div>
  );
};

export default SketchViewer;
