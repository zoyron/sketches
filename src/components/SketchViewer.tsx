import React from "react";
import { Sketch } from "../types/Sketch";
import { Box, Typography } from "@mui/material";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const SketchComponent = sketch.component;
  return (
    <Box>
      <Typography variant="h4">{sketch.title}</Typography>
      <Typography variant="subtitle1"> by {sketch.author}</Typography>
      <SketchComponent />
    </Box>
  );
};

export default SketchViewer;
