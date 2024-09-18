import React from "react";
import Sidebar from "./Sidebar";
import SketchViewer from "./SketchViewer";
import { useParams } from "react-router-dom";
import sketches from "../data/sketches";
import { Box } from "@mui/material";

const GalleryPage: React.FC = () => {
  const { sketchId } = useParams<{ sketchId: string }>();
  const currentSketch = sketches.find((s) => s.id === sketchId) || sketches[0];
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar sketches={sketches} />
      <SketchViewer sketch={currentSketch} />
    </Box>
  );
};

export default GalleryPage;
