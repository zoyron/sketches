import React from "react";
import { Sketch } from "../types/Sketch";
import { Link } from "react-router-dom";

interface SidebarProps {
  sketches: Sketch[];
}

const Sidebar: React.FC<SidebarProps> = ({ sketches }) => {
  return (
    <div className="h-full bg-[#16213E] text-white overflow-y-auto">
      <h3 className="text-4xl font-bold mt-8  text-center">Sketches</h3>
      <ul className="p-4 space-y-4">
        {sketches.map((sketch) => (
          <li key={sketch.id}>
            <Link
              to={`/sketch/${sketch.id}`}
              className="block bg-[#0F3460] rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
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
