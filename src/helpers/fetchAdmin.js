// ✅ CORREGIDO: QUITAR /api de la baseUrl
const baseUrl =
  import.meta.env.VITE_API_URL ||
  "https://wilful-daisey-alfalink2000-9e4a9993.koyeb.app";
//                                                              QUITAR ESTE /api → 🚫

export const fetchSinToken = async (endpoint, data, method = "GET") => {
  // ✅ Asegurar que el endpoint no empiece con /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = `${baseUrl}/${cleanEndpoint}`;

  console.log("🌐 URL completa:", url);

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

  console.log("🌐 URL completa (con token):", url);

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
