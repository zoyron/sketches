import React from "react";
import Sidebar from "./Sidebar";
import SketchViewer from "./SketchViewer";
import { useParams } from "react-router-dom";
import sketches from "../data";

const GalleryPage: React.FC = () => {
  const { sketchId } = useParams<{ sketchId: string }>();
  const currentSketch = sketches.find((s) => s.id === sketchId) || sketches[0];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-84 flex-shrink-0">
        {" "}
        {/* Width defined here */}
        <Sidebar sketches={sketches} />
      </div>
      <div className="flex-grow overflow-hidden bg-white shadow-xl flex justify-center items-center">
        <SketchViewer sketch={currentSketch} />
      </div>
    </div>
  );
};

export default GalleryPage;
