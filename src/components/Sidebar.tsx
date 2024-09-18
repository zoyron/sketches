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
        <li>Sketch - 1</li>
        <li>Sketch - 2</li>
        <li>Sketch - 3</li>
      </ul>
    </div>
  );
};

export default Sidebar;
