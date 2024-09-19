import React from "react";
import { Sketch } from "../types/Sketch";
import { Link } from "react-router-dom";

interface SidebarProps {
  sketches: Sketch[];
}

const Sidebar: React.FC<SidebarProps> = ({ sketches }) => {
  return (
    <div className="w-60 h-full bg-white shadow-md overflow-y-auto">
      <h2 className="text-xl font-semibold p-4">Sketches</h2>
      <ul>
        {sketches.map((sketch) => (
          <li key={sketch.id} className="border-b last:border-b-0">
            <Link
              to={`/sketch/${sketch.id}`}
              className="block p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="space-y-2">
                <img
                  src={sketch.thumbnailURL}
                  alt={sketch.title}
                  className="w-full h-auto"
                />
                <p className="text-sm font-medium">{sketch.title}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
