import React from "react";
import { Sketch } from "../types/Sketch";

interface SketchInfoProps {
  sketch: Sketch;
  isOpen: boolean;
  onClose: () => void;
}

const SketchInfo: React.FC<SketchInfoProps> = ({ sketch, isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-noir/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Inspector Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-charcoal/98 backdrop-blur-xl border-r border-gray-400/10 shadow-2xl z-50 transition-transform duration-700 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400/60 hover:text-white transition-all duration-300 flex items-center justify-center group"
          aria-label="Close info panel"
        >
          <svg
            className="w-6 h-6 transition-transform group-hover:rotate-90 duration-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="h-full overflow-y-auto p-8 pt-20 md:pt-8">
          {/* Title */}
          <div className="mb-12 pb-8 border-b border-gray-400/10">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-3 tracking-tight leading-tight font-light italic">
              {sketch.title}
            </h2>
            <p className="font-body text-gray-400 text-xs tracking-[0.2em] uppercase">
              By {sketch.author}
            </p>
          </div>

          {/* Description */}
          {sketch.description && (
            <div className="mb-10">
              <h3 className="font-body text-gray-300 text-xs font-medium tracking-[0.3em] uppercase mb-4">
                About
              </h3>
              <p className="font-body text-gray-300/90 text-sm md:text-base leading-relaxed">
                {sketch.description}
              </p>
            </div>
          )}

          {/* Technologies */}
          {sketch.technologies && sketch.technologies.length > 0 && (
            <div className="mb-10">
              <h3 className="font-body text-gray-300 text-xs font-medium tracking-[0.3em] uppercase mb-4">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {sketch.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 border border-gray-400/20 text-gray-300 font-body text-xs tracking-wide hover:border-gray-300/40 hover:text-white transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source Code Link */}
          {sketch.sourceCodeUrl && (
            <div className="mb-10">
              <h3 className="font-body text-gray-300 text-xs font-medium tracking-[0.3em] uppercase mb-4">
                Source
              </h3>
              <a
                href={sketch.sourceCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-5 py-3 border border-gray-400/20 hover:border-gray-300/40 text-gray-300 hover:text-white font-body text-sm tracking-wide transition-all duration-500 group"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>View on GitHub</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* Keyboard Shortcuts */}
          <div className="mt-12 pt-8 border-t border-gray-400/10">
            <h3 className="font-body text-gray-300 text-xs font-medium tracking-[0.3em] uppercase mb-4">
              Navigation
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-body text-gray-300/70 text-sm">Next</span>
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 border border-gray-400/20 text-gray-300 text-xs font-mono">
                    →
                  </kbd>
                  <kbd className="px-2 py-1 border border-gray-400/20 text-gray-300 text-xs font-mono">
                    ↓
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-gray-300/70 text-sm">Previous</span>
                <div className="flex gap-2">
                  <kbd className="px-2 py-1 border border-gray-400/20 text-gray-300 text-xs font-mono">
                    ←
                  </kbd>
                  <kbd className="px-2 py-1 border border-gray-400/20 text-gray-300 text-xs font-mono">
                    ↑
                  </kbd>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-body text-gray-300/70 text-sm">Close</span>
                <kbd className="px-2 py-1 border border-gray-400/20 text-gray-300 text-xs font-mono">
                  Esc
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SketchInfo;
