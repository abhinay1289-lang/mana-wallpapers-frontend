import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    base: "/mana-wallpapers-frontend/",  // Add this line with your repo name
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "https://mana-wallpapers-backend.onrender.com",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          routing: ["react-router-dom"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
});
