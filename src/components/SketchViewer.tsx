import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const SketchComponent = sketch.component;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-grow overflow-hidden flex justify-center items-center bg-white">
        <SketchComponent />
      </div>
    </div>
  );
};

export default SketchViewer;
