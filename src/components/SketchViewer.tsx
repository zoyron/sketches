import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const SketchComponent = sketch.component;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-4">
        <h1 className="text-2xl font-bold">{sketch.title}</h1>
        <p className="text-sm text-gray-600">by {sketch.author}</p>
      </div>
      <div className="flex-grow overflow-hidden flex justify-center items-center">
        <SketchComponent />
      </div>
    </div>
  );
};

export default SketchViewer;
