import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite + React setup. The dev server proxy forwards any request
// starting with /api straight to the backend on port 5000, so in our own
// code we can just call fetch("/api/leads") without hardcoding a host -
// handy for avoiding CORS headaches during development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
