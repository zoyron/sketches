import React from "react";
import { Sketch } from "../types/Sketch";

interface SidebarProps {
  sketches: Sketch[];
}

const Sidebar: React.FC<SidebarProps> = ({ sketches }) => {
  return (
    <div
      style={{
        width: "200px",
        borderRight: "1px solid #ccc",
        paddingLeft: "10px",
      }}
    >
      <h2>Sketches</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {sketches.map((sketch) => (
          <li key={sketch.id} style={{ marginBottom: "10px" }}>
            <img
              src={sketch.thumbnailURL}
              alt={sketch.title}
              style={{ width: "90%", height: "90%" }}
            />
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
