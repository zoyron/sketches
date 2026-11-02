import React from "react";

interface SketchErrorBoundaryProps {
  children: React.ReactNode;
}

interface SketchErrorBoundaryState {
  hasFailed: boolean;
}

// Keeps the menu and the rest of the gallery usable when a sketch can't load or crashes
class SketchErrorBoundary extends React.Component<SketchErrorBoundaryProps, SketchErrorBoundaryState> {
  state: SketchErrorBoundaryState = { hasFailed: false };

  static getDerivedStateFromError(): SketchErrorBoundaryState {
    return { hasFailed: true };
  }

  render() {
    if (!this.state.hasFailed) return this.props.children;

    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-8 bg-noir">
        <p className="text-gray-300/80 font-body font-light tracking-[0.3em] text-xs uppercase">
          This sketch couldn't be loaded
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-3 border border-gray-400/20 hover:border-gray-300/40 text-gray-300 hover:text-white font-body text-sm tracking-wide transition-all duration-500"
        >
          Reload
        </button>
      </div>
    );
  }
}

export default SketchErrorBoundary;
