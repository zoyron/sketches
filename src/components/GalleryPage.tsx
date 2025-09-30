import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import SketchViewer from "./SketchViewer";
import sketches from "../data";

const GalleryPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(true);
  const { sketchId } = useParams<{ sketchId: string }>();
  const currentSketch = sketches.find((s) => s.id === sketchId) || sketches[0];

  return (
    <div className="relative h-screen overflow-hidden bg-stone-50">
      {/* Mobile Menu Button - Floating Action Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed bottom-8 right-8 z-30 w-14 h-14 bg-stone-900 hover:bg-emerald-700 text-amber-50 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Open sketches menu"
      >
        <svg
          className="w-6 h-6 transition-transform group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed)}
        className={`hidden md:flex fixed top-1/2 -translate-y-1/2 z-50 w-10 h-20 bg-stone-900 hover:bg-emerald-700 text-amber-50 rounded-r-xl shadow-xl hover:shadow-2xl transition-all duration-300 items-center justify-center group ${
          isDesktopSidebarCollapsed ? "left-0" : "left-[320px]"
        }`}
        aria-label={isDesktopSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${
            isDesktopSidebarCollapsed ? "" : "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Desktop Layout */}
      <div className="flex h-full">
        {/* Sidebar Container */}
        <div
          className={`
          fixed inset-y-0 left-0 z-40
          w-full max-w-md
          md:w-80 md:min-w-[320px] md:max-w-[320px]
          transition-transform duration-500 ease-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isDesktopSidebarCollapsed ? "md:-translate-x-full" : "md:translate-x-0"}
        `}
        >
          <Sidebar
            sketches={sketches}
            onClose={() => setIsSidebarOpen(false)}
            isMobileView={isSidebarOpen}
          />
        </div>

        {/* Main Content */}
        <div className={`flex-grow overflow-hidden bg-stone-100 transition-all duration-500 ${
          isDesktopSidebarCollapsed ? "md:ml-0" : "md:ml-[320px]"
        }`}>
          <SketchViewer sketch={currentSketch} />
        </div>

        {/* Mobile Overlay */}
        <div
          className={`
            fixed inset-0 bg-stone-900/60 backdrop-blur-md z-30 md:hidden
            transition-opacity duration-500
            ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setIsSidebarOpen(false)}
        />
      </div>
    </div>
  );
};

export default GalleryPage;
