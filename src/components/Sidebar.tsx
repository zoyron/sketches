import React from "react";
import { Sketch } from "../types/Sketch";
import { Drawer, List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";

interface SidebarProps {
  sketches: Sketch[];
}

const Sidebar: React.FC<SidebarProps> = ({ sketches }) => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
    >
      <h2 style={{ paddingLeft: "15px" }}>Sketches</h2>
      <List>
        {sketches.map((sketch) => (
          <ListItem
            key={sketch.id}
            component={Link}
            to={`/sketch/${sketch.id}`}
          >
            <div>
              <img
                src={sketch.thumbnailURL}
                alt={sketch.title}
                style={{ width: "90%", height: "90%" }}
              />
              {sketch.title}
              <hr />
            </div>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
