import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const SketchComponent = sketch.component;

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30">
      {/* Canvas container */}
      <div className="w-full h-full flex justify-center items-center">
        <SketchComponent />
      </div>
    </div>
  );
};

export default SketchViewer;
