import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import GalleryPage from "./components/GalleryPage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900">
      <Router>
        <Routes>
          <Route path="/sketch/:sketchId" element={<GalleryPage />} />
          <Route
            path="/"
            element={<Navigate to="/sketch/galaxy" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
