import React from "react";
import FluidBackground from "./FluidBackground";

interface HomePageProps {
  onOpenSidebar?: () => void;
}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative overflow-hidden">
      {/* Interactive Fluid Background */}
      <FluidBackground />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16">
        {/* Main Content */}
        <div className="space-y-8 sm:space-y-12 text-center">
          <div className="space-y-6 sm:space-y-8">

            <div className="space-y-3 sm:space-y-4">
              <h1
                className="text-6xl sm:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Sarlloc
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-gray-400"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-base sm:text-lg font-light text-gray-300 tracking-[0.2em] uppercase">
                    Creative Developer
                  </p>
                  <p className="text-xs text-gray-400 font-light">
                    Sagar Arora
                  </p>
                </div>
                <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-gray-400"></div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed">
              Exploring the intersection of code and creativity through{" "}
              <span className="relative inline-block group">
                <span className="relative z-10 font-semibold text-white italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Three.js
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-2 bg-gray-400/60 -rotate-1 group-hover:rotate-1 transition-transform duration-300"></span>
              </span>
              {" "}experiments
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-6 text-sm text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-light">Click the grid menu in the top-right corner</span>
          </div>
        </div>

        {/* Navigation Links - Bottom */}
        <nav className="absolute bottom-8 left-1/2 -translate-x-1/2 sm:bottom-12 flex items-center gap-6 sm:gap-8">
          <a
            href="https://twitter.com/sarlloc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
          >
            Twitter
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="https://github.com/zoyron/sketches"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
          >
            GitHub
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="https://www.linkedin.com/in/sagar-arora-b99a371ab/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
          >
            LinkedIn
          </a>
          <span className="text-gray-600">•</span>
          <a
            href="https://buymeacoffee.com/sarlloc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300"
          >
            Support
          </a>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;
