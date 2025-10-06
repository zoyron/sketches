import React from "react";
import { Link, useParams } from "react-router-dom";
import { Sketch } from "../types/Sketch";

interface ExhibitionMenuProps {
  sketches: Sketch[];
  isOpen: boolean;
  onClose: () => void;
}

const ExhibitionMenu: React.FC<ExhibitionMenuProps> = ({
  sketches,
  isOpen,
  onClose,
}) => {
  const { sketchId } = useParams<{ sketchId: string }>();

  if (!isOpen) return null;

  return (
    <>
      {/* Elegant Background Overlay */}
      <div
        className="fixed inset-0 z-40 bg-noir/95 backdrop-blur-2xl transition-opacity duration-700"
        style={{ opacity: isOpen ? 1 : 0, touchAction: 'pan-y' }}
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="fixed top-12 right-12 z-50 w-10 h-10 text-gray-400/60 hover:text-white transition-all duration-300 flex items-center justify-center group"
          aria-label="Close menu"
        >
          <svg
            className="w-8 h-8 transition-transform group-hover:rotate-90 duration-500"
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

        {/* Gallery Container */}
        <div className="fixed inset-0 overflow-y-auto z-40 px-8 py-24 md:px-16 lg:px-24" style={{ touchAction: 'pan-y' }}>
          <div className="max-w-[1800px] mx-auto">
            {/* Refined Header */}
            <div className="mb-20">
              <p className="font-body text-gray-400 text-xs tracking-[0.3em] uppercase mb-4 text-center">
                Collection
              </p>
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight text-center font-light italic">
                Études
              </h2>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-6"></div>
              <p className="font-body text-gray-300/80 text-sm text-center">
                {sketches.length} experiments in digital form
              </p>
            </div>

            {/* Homepage Link */}
            <div className="mb-16 flex justify-center">
              <button
                onClick={() => {
                  window.location.href = '/sketch/homepage';
                }}
                className="px-8 py-3 border border-gray-400/20 hover:border-gray-300/40 text-gray-300 hover:text-white font-body text-sm tracking-wider transition-all duration-500 flex items-center gap-3 group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Return Home</span>
              </button>
            </div>

            {/* Sophisticated List Layout */}
            <div className="space-y-1 max-w-5xl mx-auto">
              {sketches.map((sketch, index) => {
                const isActive = sketch.id === sketchId;
                return (
                  <Link
                    key={sketch.id}
                    to={`/sketch/${sketch.id}`}
                    onClick={onClose}
                    className="group block transition-all duration-500"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`,
                    }}
                  >
                    <div className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 px-4 sm:px-8 py-4 sm:py-6 border-b transition-all duration-500 ${
                      isActive
                        ? 'border-gray-400/40 bg-gray-800/30'
                        : 'border-gray-700/50 hover:border-gray-300/30 hover:bg-gray-800/10'
                    }`}>
                      {/* Mobile: Number + Title in one line */}
                      <div className="flex items-center gap-4 w-full sm:contents">
                        {/* Number */}
                        <div className={`font-body text-sm tracking-wider transition-colors duration-300 w-8 sm:w-12 flex-shrink-0 ${
                          isActive ? 'text-gray-300' : 'text-gray-500/50 group-hover:text-gray-300'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Thumbnail - Minimal */}
                        <div className="relative w-20 h-12 sm:w-32 sm:h-20 overflow-hidden flex-shrink-0">
                          <img
                            src={sketch.thumbnailURL}
                            alt={sketch.title}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-noir/40 to-transparent"></div>
                        </div>

                        {/* Title */}
                        <div className="flex-grow min-w-0">
                          <h3 className={`font-heading text-lg sm:text-2xl md:text-3xl font-light italic tracking-tight transition-colors duration-300 truncate sm:whitespace-normal ${
                            isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`}>
                            {sketch.title}
                          </h3>
                        </div>

                        {/* Arrow */}
                        <div className={`hidden sm:block transition-all duration-300 flex-shrink-0 ${
                          isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
                        }`}>
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default ExhibitionMenu;
