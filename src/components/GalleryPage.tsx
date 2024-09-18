import React from "react";
import { Sketch } from "../types/Sketch";
import Sidebar from "./Sidebar";
import SketchViewer from "./SketchViewer";

const GalleryPage: React.FC = () => {
  const sketches: Sketch[] = [
    {
      id: 1,
      title: "Sketch 1",
      author: "Sagar",
      thumbnailURL: "/sidebar/sparkles.png",
    },
    {
      id: 2,
      title: "Sketch 2",
      author: "Sagar",
      thumbnailURL: "/sidebar/sparkles.png",
    },
    {
      id: 3,
      title: "Sketch 3",
      author: "Sagar",
      thumbnailURL: "/sidebar/sparkles.png",
    },
  ];
  return (
    <div style={{ display: "flex" }}>
      <Sidebar sketches={sketches} />
      <SketchViewer sketch={sketches[0]} />
    </div>
  );
};

export default GalleryPage;
