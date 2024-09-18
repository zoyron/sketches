import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import GalleryPage from "./components/GalleryPage";

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/sketch/:sketchId" element={<GalleryPage />} />
          <Route
            path="/"
            element={<Navigate to="/sketch/rotating-cube" replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
