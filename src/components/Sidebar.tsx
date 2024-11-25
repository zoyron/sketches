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
    <div className="h-full bg-[#16213E] text-white overflow-y-auto relative">
      {/* Header */}
      <div className="sticky top-0 bg-[#16213E] z-10 p-4 flex justify-between items-center">
        <h3 className="text-2xl md:text-4xl font-bold">Sketches</h3>
        {isMobileView && (
          <button
            onClick={onClose}
            className="md:hidden p-2 text-white"
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
              <img
                src={sketch.thumbnailURL}
                alt={sketch.title}
                className="w-full h-32 md:h-40 object-cover"
              />
              <p className="text-sm font-medium p-3 md:p-4 truncate">
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
