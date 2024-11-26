import React from "react";
import { Sketch } from "../types/Sketch";
import { Link } from "react-router-dom";

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
  return (
    <div className="h-full w-full min-w-[240px] max-w-[320px] bg-[#16213E] text-white overflow-y-auto relative">
      {/* Header */}
      <div className="sticky top-0 bg-[#16213E] z-10 p-4 flex justify-between items-center">
        <h3 className="text-xl lg:text-2xl font-bold">Sketches</h3>
        {isMobileView && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-white"
            aria-label="Close sidebar"
          >
            <span className="text-2xl">✕</span>
          </button>
        )}
      </div>
      {/* Sketches List */}
      <ul className="p-4 space-y-4">
        {sketches.map((sketch) => (
          <li key={sketch.id}>
            <Link
              to={`/sketch/${sketch.id}`}
              onClick={() => isMobileView && onClose?.()}
              className="block bg-[#0F3460] rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative w-full pt-[56.25%]">
                <img
                  src={sketch.thumbnailURL}
                  alt={sketch.title}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium p-3 truncate">
                {sketch.title}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
