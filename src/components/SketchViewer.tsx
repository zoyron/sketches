import React, { useState, useEffect } from "react";
import { Sketch } from "../types/Sketch";

interface SketchViewerProps {
  sketch: Sketch;
  onOpenSidebar: () => void;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch, onOpenSidebar }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);
  const SketchComponent = sketch.component;

  useEffect(() => {
    // Reset states when sketch changes
    setIsLoading(true);
    setFadeIn(false);

    // Show sketch after a brief delay for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setFadeIn(true), 50);
    }, 300);

    return () => clearTimeout(timer);
  }, [sketch.id]);

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30">
          <div className="relative">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-stone-200 border-t-emerald-600 rounded-full animate-spin"></div>
            {/* Pulse effect */}
            <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-600/20 rounded-full animate-ping"></div>
          </div>
          <p className="mt-6 text-stone-600 font-light tracking-wide text-sm">Loading sketch...</p>
        </div>
      )}

      {/* Canvas container with fade transition */}
      <div className={`w-full h-full flex justify-center items-center transition-opacity duration-500 ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}>
        <SketchComponent onOpenSidebar={onOpenSidebar} />
      </div>
    </div>
  );
};

export default SketchViewer;
