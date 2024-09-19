import React from "react";
import Sidebar from "./Sidebar";
import SketchViewer from "./SketchViewer";
import { useParams } from "react-router-dom";
import sketches from "../data";
import { Box } from "@mui/material";

const GalleryPage: React.FC = () => {
  const { sketchId } = useParams<{ sketchId: string }>();
  const currentSketch = sketches.find((s) => s.id === sketchId) || sketches[0];

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar sketches={sketches} />
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <SketchViewer sketch={currentSketch} />
      </Box>
    </Box>
  );
};

export default GalleryPage;
