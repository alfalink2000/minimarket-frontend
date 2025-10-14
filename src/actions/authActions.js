import { fetchConToken, fetchSinToken } from "../helpers/fetchAdmin";
import { types } from "../types/types";
import Swal from "sweetalert2";

export const checkingFinish = () => ({
  type: types.authCheckingFinish,
});

export const startLoading = () => ({
  type: types.authStartLoading,
});

export const finishLoading = () => ({
  type: types.authFinishLoading,
});

export const StartLogin = (username, password) => {
  return async (dispatch) => {
    dispatch(startLoading()); // ✅ Iniciar loading

    console.log("🔐 Enviando login:", { username });

    try {
      const body = await fetchSinToken(
        "auth",
        {
          username,
          password_hash: password,
        },
        "POST"
      );

      console.log("📦 Body completo:", body);

      if (body.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Login exitoso!",
          text: "Bienvenido al panel de administración",
          showConfirmButton: false,
          timer: 1500,
          background: "#f0f9ff",
          iconColor: "#10b981",
        });

        localStorage.setItem("token", body.token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(
          login({
            uid: body.id,
            name: body.username,
          })
        );
      } else {
        // ✅ MEJOR MANEJO DE ERRORES ESPECÍFICOS
        let errorMessage = "Credenciales incorrectas";

        if (body.msg) {
          // Mapear mensajes del backend a mensajes más amigables
          const errorMessages = {
            "Usuario no encontrado": "El usuario no existe en el sistema",
            "Contraseña incorrecta": "La contraseña es incorrecta",
            "Usuario inactivo": "La cuenta está desactivada",
            "Credenciales inválidas": "Usuario o contraseña incorrectos",
          };

          errorMessage = errorMessages[body.msg] || body.msg;
        }

        Swal.fire({
          icon: "error",
          title: "Error de autenticación",
          text: errorMessage,
          confirmButtonColor: "#ef4444",
          background: "#fef2f2",
          iconColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error en login:", error);

      let errorMessage = "Ha ocurrido un error inesperado";
      let errorTitle = "Error";

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        errorTitle = "Error de conexión";
        errorMessage =
          "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      } else if (error.message.includes("respuesta no es JSON")) {
        errorTitle = "Error del servidor";
        errorMessage = "El servidor respondió con un formato inválido.";
      } else if (error.message.includes("Timeout")) {
        errorTitle = "Tiempo de espera agotado";
        errorMessage = "La petición tardó demasiado. Intenta nuevamente.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorMessage,
        confirmButtonColor: "#ef4444",
        background: "#fef2f2",
        iconColor: "#dc2626",
      });
    } finally {
      dispatch(finishLoading()); // ✅ Finalizar loading siempre
    }
  };
};

export const StartChecking = () => {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(checkingFinish());
        return;
      }

      const body = await fetchConToken("auth/renew");

      if (body && body.ok) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("token-init-date", new Date().getTime());

        dispatch(
          login({
            uid: body.uid || body.id,
            name: body.name || body.username,
          })
        );
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("token-init-date");
        dispatch(checkingFinish());
      }
    } catch (error) {
      console.error("Error en verificación de token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("token-init-date");
      dispatch(checkingFinish());
    }
  };
};

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(logout());
    Swal.fire({
      icon: "info",
      title: "Sesión cerrada",
      text: "Has cerrado sesión correctamente",
      showConfirmButton: false,
      timer: 1500,
      background: "#f0f9ff",
      iconColor: "#3b82f6",
    });
  };
};

const logout = () => ({ type: types.authLogout });

const login = (user) => ({
  type: types.authLogin,
  payload: user,
});
