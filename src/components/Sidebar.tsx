import React from "react";
import { Sketch } from "../types/Sketch";
import { Link, useParams } from "react-router-dom";

interface SidebarProps {
  sketches: Sketch[];
  onClose?: () => void;
  isMobileView?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  sketches,
  onClose,
  isMobileView,
}) => {
  const { sketchId } = useParams<{ sketchId: string }>();

  return (
    <div className="h-full w-full bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 overflow-y-auto relative border-r border-stone-200 shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-stone-50/95 to-stone-50/80 backdrop-blur-xl z-10 px-6 py-8 border-b border-stone-200/80">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2
              className="text-3xl lg:text-4xl font-bold text-stone-900 mb-2 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Collection
            </h2>
            <p className="text-sm text-stone-600 font-light tracking-wide">
              {sketches.length - 1} 3D experiments
            </p>
          </div>
          {isMobileView && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-200/50 rounded-full transition-all duration-300 -mr-2"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Sketches Grid */}
      <div className="p-4 lg:p-6 space-y-4">
        {sketches.map((sketch) => {
          const isActive = sketch.id === sketchId;
          return (
            <Link
              key={sketch.id}
              to={`/sketch/${sketch.id}`}
              onClick={() => isMobileView && onClose?.()}
              className={`group block rounded-2xl overflow-hidden transition-all duration-500 ${
                isActive
                  ? "ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.02]"
                  : "hover:shadow-2xl hover:scale-[1.01] shadow-md"
              }`}
            >
              <div className="relative w-full pt-[60%] bg-stone-200/50">
                <img
                  src={sketch.thumbnailURL}
                  alt={sketch.title}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
                  isActive
                    ? "from-emerald-900/40 via-transparent to-transparent opacity-80"
                    : "from-stone-900/60 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-40"
                }`}></div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 rounded-full">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-white tracking-wide">Viewing</span>
                    </div>
                  </div>
                )}
              </div>

              <div className={`p-4 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-t-2 border-emerald-200"
                  : "bg-white/80 backdrop-blur-sm group-hover:bg-white"
              }`}>
                <h3 className={`text-base lg:text-lg font-semibold tracking-tight transition-colors duration-300 truncate ${
                  isActive ? "text-emerald-900" : "text-stone-900 group-hover:text-emerald-700"
                }`}>
                  {sketch.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="sticky bottom-0 h-16 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default Sidebar;
