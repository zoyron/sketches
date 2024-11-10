import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#1a1a2e] text-gray-100 font-sans flex items-center justify-center">
      <div className="w-full text-center">
        <h1 className="text-7xl font-medium mb-8 text-white">
          Hello, I'm
          <span className="block mt-4 text-indigo-400">Sagar</span>
        </h1>

        <p className="text-3xl text-gray-400">
          Welcome to my creative corner where I explore and experiment with
          ThreeJS
        </p>
      </div>
    </div>
  );
};

export default HomePage;
