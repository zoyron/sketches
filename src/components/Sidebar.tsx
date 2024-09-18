import React from "react";
import { Sketch } from "../types/Sketch";

interface SidebarProps {
  sketches: Sketch[];
}

const Sidebar: React.FC<SidebarProps> = ({ sketches }) => {
  return (
    <div>
      <h2>Sketches</h2>
      <ul>
        {sketches.map((sketch) => (
          <li key={sketch.id}>{sketch.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
