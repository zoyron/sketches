import React from "react";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <div>
      <h1>hello world</h1>
      <p>Threejs sketch gallery</p>
      <Sidebar sketches={[{ id: "1", title: "sketch 1" }]} />
    </div>
  );
};

export default App;
