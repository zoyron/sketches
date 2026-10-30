import React, { useState } from "react";
import { isTouchDevice } from "../lib/isTouchDevice";
import { SketchHint } from "../types/Sketch";

interface InteractionHintProps {
  hint: SketchHint;
}

const InteractionHint: React.FC<InteractionHintProps> = ({ hint }) => {
  const [isTouch] = useState(isTouchDevice);
  const text = isTouch ? hint.touch : hint.mouse;

  if (!text) return null;

  return (
    <div className="absolute bottom-8 right-8 pointer-events-none">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/40 backdrop-blur-sm border border-white/10">
        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <span className="text-xs sm:text-sm font-medium text-white/70 tracking-wide">
          {text}
        </span>
      </div>
    </div>
  );
};

export default InteractionHint;
