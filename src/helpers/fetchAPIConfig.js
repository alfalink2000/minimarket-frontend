// helpers/fetchAPIConfig.js - VERSIÓN MEJORADA PARA PRODUCCIÓN

// ✅ URL base dinámica para desarrollo/producción
const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

console.log("🔧 Configuración API:", {
  baseUrl,
  environment: import.meta.env.VITE_NODE_ENV || "development",
});

export const fetchAPIConfig = (
  endpoint,
  data,
  method = "GET",
  isFormData = false
) => {
  const url = `${baseUrl}/${endpoint}`;
  const token = localStorage.getItem("token") || "";

  console.log("🌐 Realizando petición a:", url);

  const config = {
    method,
    headers: {
      "x-token": token,
    },
  };

  // ✅ NUEVO: Timeout para producción
  const timeout = 15000; // 15 segundos

  const fetchPromise = fetch(url, config);

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error("Timeout: La petición tardó demasiado")),
      timeout
    )
  );

  if (method === "GET") {
    return Promise.race([fetchPromise, timeoutPromise]);
  } else {
    if (isFormData) {
      // Para FormData - NO establecer Content-Type
      config.body = data;
    } else {
      // Para JSON normal
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }

    return Promise.race([fetch(url, config), timeoutPromise]);
  }
};
