// helpers/fetchPublic.js - VERSIÓN OPTIMIZADA PARA PRODUCCIÓN

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// ✅ NUEVO: Solo mostrar logs en desarrollo
const isDevelopment = import.meta.env.VITE_NODE_ENV === "development";

export const fetchPublic = (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;

  if (isDevelopment) {
    console.log("🌐 [DEBUG] Intentando conectar a:", url);
    console.log("🔧 [DEBUG] Método:", method);
  }

  // ✅ NUEVO: Configuración mejorada
  const config = {
    method,
    headers: {
      "Content-type": "application/json",
    },
    // ✅ NUEVO: Timeout para producción
    signal: AbortSignal.timeout(10000), // 10 segundos timeout
  };

  if (method !== "GET") {
    config.body = JSON.stringify(data);
  }

  return fetch(url, config)
    .then((response) => {
      if (isDevelopment) {
        console.log("✅ [DEBUG] Response status:", response.status);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    })
    .catch((error) => {
      if (isDevelopment) {
        console.error("❌ [DEBUG] Error de fetch:", error);
      }
      throw error;
    });
};
