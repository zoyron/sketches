import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const SketchComponent = sketch.component;

  return (
    <div className="w-full h-full relative">
      <div
        className="absolute top-4 md:top-8 left-24 md:left-8 text-[#E94560] 
                   text-xl md:text-4xl font-bold z-10 pointer-events-none"
        style={{ fontFamily: "Verdana, sans-serif" }}
      >
        {sketch.title}
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <SketchComponent />
      </div>
    </div>
  );
};

export default SketchViewer;
