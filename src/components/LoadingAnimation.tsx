import React from "react";

const LoadingAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-noir">
      <div className="relative w-16 h-16">
        {/* Elegant rotating ring */}
        <div className="absolute inset-0 rounded-full border border-gray-400/20 animate-spin" style={{ animationDuration: '3s' }}></div>

        {/* Inner accent */}
        <div className="absolute inset-2 rounded-full border border-gray-300/40 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
      </div>

      <p className="mt-8 text-gray-400/60 font-body font-light tracking-[0.3em] text-xs uppercase">
        Loading
      </p>
    </div>
  );
};

export default LoadingAnimation;
