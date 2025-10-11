// ✅ URL base dinámica para desarrollo/producción
const baseUrl =
  (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

// ✅ Solo logs en desarrollo
const isDevelopment = import.meta.env.VITE_NODE_ENV === "development";

export const fetchAPIConfig = (
  endpoint,
  data,
  method = "GET",
  isFormData = false
) => {
  const url = `${baseUrl}/${endpoint}`;
  const token = localStorage.getItem("token") || "";

  if (isDevelopment) {
    console.log("🌐 Realizando petición a:", url);
  }

  const config = {
    method,
    headers: {
      "x-token": token,
    },
  };

  // ✅ Timeout para producción
  const timeout = 15000;

  if (method === "GET") {
    const fetchPromise = fetch(url, config);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: La petición tardó demasiado")),
        timeout
      )
    );

    return Promise.race([fetchPromise, timeoutPromise]).then(
      async (response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        // ✅ DEVOLVER JSON directamente
        return await response.json();
      }
    );
  } else {
    if (isFormData) {
      config.body = data;
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = JSON.stringify(data);
    }

    const fetchPromise = fetch(url, config);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: La petición tardó demasiado")),
        timeout
      )
    );

    return Promise.race([fetchPromise, timeoutPromise]).then(
      async (response) => {
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        // ✅ DEVOLVER JSON directamente
        return await response.json();
      }
    );
  }
};
