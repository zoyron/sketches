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
        className="absolute top-6 left-0 w-full md:w-auto md:top-8 sm:left-8 
                   text-[#E94560] text-xl sm:text-4xl font-bold z-10 
                   pointer-events-none text-center sm:text-left"
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
