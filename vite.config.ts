import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import restart from "vite-plugin-restart";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    restart({ restart: ["./static/**"] }), // Restart server on static file change
    glsl(), // Handle shader files
  ],
  optimizeDeps: {
    include: ["three", "three/examples/jsm/controls/OrbitControls"],
  },
});
