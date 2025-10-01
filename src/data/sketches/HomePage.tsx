import React from "react";

interface HomePageProps {
  onOpenSidebar?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onOpenSidebar }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Organic background shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-gradient-to-br from-emerald-200 to-teal-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-gradient-to-br from-rose-200 to-orange-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-100 to-orange-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16">
        {/* Main Content */}
        <div className="space-y-8 sm:space-y-12 text-center">
          <div className="space-y-6 sm:space-y-8">

            <div className="space-y-3 sm:space-y-4">
              <h1
                className="text-6xl sm:text-8xl lg:text-9xl font-bold text-stone-900 tracking-tight leading-none"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Sarlloc
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-stone-400"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-base sm:text-lg font-light text-stone-600 tracking-[0.2em] uppercase">
                    Creative Developer
                  </p>
                  <p className="text-xs text-stone-400 font-light">
                    Sagar Arora
                  </p>
                </div>
                <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-stone-400"></div>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <p className="text-lg sm:text-xl lg:text-2xl text-stone-700 font-light leading-relaxed">
              Exploring the intersection of code and creativity through{" "}
              <span className="relative inline-block group">
                <span className="relative z-10 font-semibold text-emerald-700 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Three.js
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-2 bg-emerald-200/60 -rotate-1 group-hover:rotate-1 transition-transform duration-300"></span>
              </span>
              {" "}experiments
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-6 text-sm text-stone-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="font-light">Browse sketches in the sidebar</span>
          </div>
        </div>

        {/* Navigation Links - Bottom */}
        <nav className="absolute bottom-8 right-8 sm:bottom-12 sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-6 sm:gap-8">
          <a
            href="https://twitter.com/sarlloc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors duration-300"
          >
            Twitter
          </a>
          <span className="text-stone-300">•</span>
          <a
            href="https://github.com/zoyron/sketches"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors duration-300"
          >
            GitHub
          </a>
          <span className="text-stone-300">•</span>
          <a
            href="https://buymeacoffee.com/sarlloc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium text-stone-500 hover:text-emerald-700 transition-colors duration-300"
          >
            Support
          </a>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;
