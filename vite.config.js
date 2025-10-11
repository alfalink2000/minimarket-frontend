// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
// vite.config.js - PARA PRODUCCIÓN EN VERCEL
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // ✅ Para Vercel, usa base relativa o vacía
  base: "/",
  // ❌ Elimina esto: base: '/minimarket-frontend/',

  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 3000,
  },
});
