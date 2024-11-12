import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#1a1a2e] text-gray-100 font-sans flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-7xl font-medium m-8 text-white">
          Hello, I'm
          <span className="block mt-4 text-[#7e5bef]">SAGAR</span>
        </h1>
        <p className="text-3xl m-8 text-gray-400">
          Welcome to my creative corner where I explore and experiment with
          <span className="mt-4 text-[#ff49db]"> ThreeJs</span>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
