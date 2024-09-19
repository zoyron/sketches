import React, { useEffect, useRef } from "react";
import { Sketch } from "../types/Sketch";
import { Box, Typography } from "@mui/material";

interface SketchViewerProps {
  sketch: Sketch;
}

const SketchViewer: React.FC<SketchViewerProps> = ({ sketch }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      sketch.sketchFunction();
    }
  }, [sketch]);

  return (
    <Box>
      <Typography variant="h4">{sketch.title}</Typography>
      <Typography variant="subtitle1"> by {sketch.author}</Typography>
      <Box
        ref={containerRef}
        className="sketch-container"
        sx={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};

export default SketchViewer;
