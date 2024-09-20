import React from "react";
import { Sketch } from "../types/Sketch";
import { Link } from "react-router-dom";

interface SidebarProps {
  sketches: Sketch[];
}

const Sidebar: React.FC<SidebarProps> = ({ sketches }) => {
  return (
    <div className="w-72 h-full bg-gray-800 text-white overflow-y-auto">
      <h2 className="text-2xl font-bold p-6 bg-gray-900">Sketches</h2>
      <ul className="p-4 space-y-4">
        {sketches.map((sketch) => (
          <li key={sketch.id}>
            <Link
              to={`/sketch/${sketch.id}`}
              className="block bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={sketch.thumbnailURL}
                alt={sketch.title}
                className="w-full h-40 object-cover"
              />
              <p className="text-sm font-medium p-4 truncate">{sketch.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
