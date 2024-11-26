import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#16213E] via-[#0F3460] to-[#1a1a2e]">
      <div className="w-full max-w-3xl mx-auto px-6 sm:px-12">
        {/* Main Content - Moved above navigation for mobile */}
        <div className="space-y-6 text-center pt-8 sm:pt-0 sm:text-left">
          <div className="space-y-2">
            <div className="inline-block">
              <p className="text-sm sm:text-base text-[#E94560] font-light bg-white/5 px-4 py-1 rounded-full">
                Hello, I'm
              </p>
            </div>
            <h1 className="text-4xl sm:text-7xl font-bold text-white tracking-tight">
              SAGAR
            </h1>
          </div>
          <p className="text-lg sm:text-2xl text-gray-300 font-light max-w-2xl">
            Welcome to my creative corner where I explore and experiment with
            <span className="relative inline-block px-2">
              <span className="relative z-10 font-medium text-[#E94560]">
                ThreeJS
              </span>
              <span className="absolute inset-0 bg-[#E94560]/10 rounded-md -rotate-2"></span>
            </span>
          </p>
        </div>

        {/* Navigation Links - Modified for mobile responsiveness */}
        <div className="flex justify-center mt-12 sm:mt-0 sm:absolute sm:top-8 sm:right-8 sm:justify-end space-x-6">
          <a
            href="https://twitter.com/sarlloc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#E94560] hover:text-white transition-colors duration-300"
          >
            Twitter
          </a>
          <a
            href="https://github.com/zoyron/sketches"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#E94560] hover:text-white transition-colors duration-300"
          >
            GitHub
          </a>
          <a
            href="https://buymeacoffee.com/sarlloc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#E94560] hover:text-white transition-colors duration-300"
          >
            Buy me a coffee
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
