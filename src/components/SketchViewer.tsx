import React from "react";
import { Sketch } from "../types/Sketch";
import { Box, Typography } from "@mui/material";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const SketchComponent = sketch.component;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">{sketch.title}</Typography>
        <Typography variant="subtitle1">by {sketch.author}</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SketchComponent />
      </Box>
    </Box>
  );
};

export default SketchViewer;
