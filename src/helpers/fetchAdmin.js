// ✅ CORREGIDO PARA VITE - usar variable directa con /api
const baseUrl =
  (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

export const fetchSinToken = async (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    console.log("🔍 Response status:", response.status);
    console.log("🔍 Response headers:", response.headers);

    // ✅ LEER LA RESPUESTA COMO TEXTO PRIMERO PARA DEBUG
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

    // ✅ DEVOLVER EL BODY COMPLETO INCLUYENDO EL MENSAJE DE ERROR
    return body;
  } catch (error) {
    console.error("❌ Error en fetchSinToken:", error);
    throw error;
  }
};

export const fetchConToken = async (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;
  const token = localStorage.getItem("token") || "";

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
