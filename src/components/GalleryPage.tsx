import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import SketchViewer from "./SketchViewer";
import sketches from "../data";

const GalleryPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { sketchId } = useParams<{ sketchId: string }>();
  const currentSketch = sketches.find((s) => s.id === sketchId) || sketches[0];

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-30 px-4 py-2 bg-[#16213E] text-white rounded-md"
      >
        Open Sketches
      </button>

      {/* Desktop Layout */}
      <div className="flex h-full">
        {/* Sidebar Container */}
        <div
          className={`
          md:w-84 md:static md:block
          fixed inset-y-0 left-0 w-84 z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:transform-none
        `}
        >
          <Sidebar
            sketches={sketches}
            onClose={() => setIsSidebarOpen(false)}
            isMobileView={isSidebarOpen}
          />
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-hidden bg-white shadow-xl">
          <SketchViewer sketch={currentSketch} />
        </div>

        {/* Mobile Overlay */}
        <div
          className={`
            fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden
            transition-opacity duration-300
            ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
};

export default GalleryPage;
