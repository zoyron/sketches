import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react"
import GalleryPage from "./components/GalleryPage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900">
      <Analytics />
      <Router>
        <Routes>
          <Route path="/sketch/:sketchId" element={<GalleryPage />} />
          <Route
            path="/"
            element={<Navigate to="/sketch/homepage" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
