import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Sketch } from "../types/Sketch";
import InteractionHint from "./InteractionHint";
import LoadingAnimation from "./LoadingAnimation";
import SketchErrorBoundary from "./SketchErrorBoundary";

const FIRST_LOAD_DURATION = 800; // ms

interface SketchViewerProps {
  sketch: Sketch;
}

// Suspense holds this back along with the sketch, so the time counts from the sketch's first render, not its download
const FirstLoadTimer: React.FC<{ onElapsed: () => void }> = ({ onElapsed }) => {
  useEffect(() => {
    const timer = setTimeout(onElapsed, FIRST_LOAD_DURATION);
    return () => clearTimeout(timer);
  }, [onElapsed]);

  return null;
};

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const finishFirstLoad = useCallback(() => setIsFirstLoad(false), []);
  const SketchComponent = sketch.component;

  return (
    <div className="w-full h-full relative bg-noir" style={{ touchAction: 'none' }}>
      {/* Loading Animation - only on first load */}
      {isFirstLoad && <LoadingAnimation />}

      {/* Keyed so leaving a sketch tears it down at once; Suspense would otherwise keep it running, hidden, while the next one downloads */}
      <SketchErrorBoundary key={sketch.id}>
        {/* Canvas container with fade transition */}
        <div
          className={`w-full h-full flex justify-center items-center transition-opacity duration-500 ${
            isFirstLoad ? "opacity-0" : "opacity-100"
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Later sketches appear without the first-load fade; the delay keeps a quick download from flashing the loader */}
          <Suspense
            fallback={
              !isFirstLoad && (
                <div className="animate-[fade-in_300ms_ease-out_150ms_both]">
                  <LoadingAnimation />
                </div>
              )
            }
          >
            {isFirstLoad && <FirstLoadTimer onElapsed={finishFirstLoad} />}
            <SketchComponent />
            {sketch.hint && <InteractionHint hint={sketch.hint} />}
          </Suspense>
        </div>
      </SketchErrorBoundary>
    </div>
  );
};

export default SketchViewer;
