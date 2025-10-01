import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ExhibitionMenu from "./ExhibitionMenu";
import SketchInfo from "./SketchInfo";
import SketchViewer from "./SketchViewer";
import sketches, { homepage } from "../data";

const GalleryPage: React.FC = () => {
  const [isLensOpen, setIsLensOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const { sketchId } = useParams<{ sketchId: string }>();
  const navigate = useNavigate();

  // If homepage, use homepage, otherwise find in sketches
  const currentSketch = sketchId === 'homepage'
    ? homepage
    : sketches.find((s) => s.id === sketchId) || sketches[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentIndex = sketches.findIndex((s) => s.id === sketchId);

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % sketches.length;
        navigate(`/sketch/${sketches[nextIndex].id}`);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + sketches.length) % sketches.length;
        navigate(`/sketch/${sketches[prevIndex].id}`);
      } else if (e.key === "Escape") {
        if (isLensOpen) setIsLensOpen(false);
        if (isInspectorOpen) setIsInspectorOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [sketchId, navigate, isLensOpen, isInspectorOpen]);

  return (
    <div className="relative h-screen overflow-hidden bg-noir">
      {/* Full-Screen Sketch Viewer */}
      <SketchViewer sketch={currentSketch} onOpenSidebar={() => setIsLensOpen(true)} />

      {/* Menu Button (Top-Right) - Always show */}
      <button
        onClick={() => setIsLensOpen(true)}
        className="fixed top-8 right-8 z-30 px-6 py-3 border-2 border-white hover:border-light-gray text-white hover:text-light-gray font-body text-sm tracking-wider transition-all duration-300 backdrop-blur-lg bg-noir/60 hover:bg-charcoal/80"
        aria-label="Open menu"
      >
        <span className="flex items-center gap-2">
          <span>Menu</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </span>
      </button>

      {/* Info Button (Bottom-Left) - Only show if not on homepage */}
      {sketchId !== 'homepage' && (
        <button
          onClick={() => setIsInspectorOpen(!isInspectorOpen)}
          className="fixed bottom-8 left-8 z-30 px-6 py-3 border-2 border-white hover:border-light-gray text-white hover:text-light-gray font-body text-sm tracking-wider transition-all duration-300 backdrop-blur-lg bg-noir/60 hover:bg-charcoal/80"
          aria-label="Toggle info panel"
        >
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <span>Info</span>
          </span>
        </button>
      )}

      {/* Exhibition Menu (Lens) */}
      <ExhibitionMenu
        sketches={sketches}
        isOpen={isLensOpen}
        onClose={() => setIsLensOpen(false)}
      />

      {/* Inspector Panel */}
      <SketchInfo
        sketch={currentSketch}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
      />
    </div>
  );
};

export default GalleryPage;
