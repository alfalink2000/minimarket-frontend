// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/minimarket-frontend/",
  // ✅ NUEVO: Configuración para producción
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
      },
    },
  },
  // ✅ NUEVO: Definir variables globales
  define: {
    "process.env": {},
  },
  // ✅ NUEVO: Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true,
  },
  // ✅ NUEVO: Previsualización para producción
  preview: {
    port: 3000,
    host: true,
  },
});
