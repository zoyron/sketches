import React, { useState, useEffect } from "react";
import { Sketch } from "../types/Sketch";
import LoadingAnimation from "./LoadingAnimation";

interface SketchViewerProps {
  sketch: Sketch;
  onOpenSidebar: () => void;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const SketchComponent = sketch.component;

  useEffect(() => {
    // Only show loading on first mount
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        setIsFirstLoad(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  return (
    <div className="w-full h-full relative bg-noir">
      {/* Loading Animation - only on first load */}
      {isFirstLoad && <LoadingAnimation />}

      {/* Canvas container with fade transition */}
      <div
        className={`w-full h-full flex justify-center items-center transition-opacity duration-500 ${
          isFirstLoad ? "opacity-0" : "opacity-100"
        }`}
      >
        <SketchComponent />
      </div>
    </div>
  );
};

export default SketchViewer;
