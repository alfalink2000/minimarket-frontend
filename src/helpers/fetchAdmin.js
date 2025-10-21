// ✅ CORREGIDO: MANTENER /api en la baseUrl - VERSIÓN UNIFICADA
const baseUrl =
  import.meta.env.VITE_API_URL ||
  "https://wilful-daisey-alfalink2000-9e4a9993.koyeb.app/api";
//                                                              AGREGAR /api AQUÍ → ✅

export const fetchSinToken = async (endpoint, data, method = "GET") => {
  // ✅ Asegurar que el endpoint no empiece con /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${baseUrl}/${cleanEndpoint}`;

  console.log("🌐 URL completa fetchSinToken:", url);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    console.log("🔍 Response status:", response.status);
    console.log("🔍 Response ok:", response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("🔍 Response text:", responseText);

    let body;
    try {
      body = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Error parseando JSON:", parseError);
      throw new Error("La respuesta del servidor no es JSON válido");
    }

    console.log("🔍 Parsed body:", body);
    return body;
  } catch (error) {
    console.error("❌ Error en fetchSinToken:", error);
    throw error;
  }
};

export const fetchConToken = async (endpoint, data, method = "GET") => {
  // ✅ Asegurar que el endpoint no empiece con /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${baseUrl}/${cleanEndpoint}`;
  const token = localStorage.getItem("token") || "";

  console.log("🌐 URL completa fetchConToken:", url);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    console.log("🔍 Response status (con token):", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    console.log("🔍 Response text (con token):", responseText);

    let body;
    try {
      body = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Error parseando JSON (con token):", parseError);
      throw new Error("La respuesta del servidor no es JSON válido");
    }

    return body;
  } catch (error) {
    console.error("❌ Error en fetchConToken:", error);
    throw error;
  }
};

// ✅ Función adicional para FormData (si la necesitas)
export const fetchAPIConfig = (
  endpoint,
  data,
  method = "GET",
  isFormData = false
) => {
  const url = `${baseUrl}/${endpoint}`;
  const token = localStorage.getItem("token") || "";

  console.log("🌐 URL completa fetchAPIConfig:", url);

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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      }
    );
  }
};
