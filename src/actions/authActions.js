import { fetchConToken, fetchSinToken } from "../helpers/fetchAdmin";
import { types } from "../types/types";
import Swal from "sweetalert2";

export const checkingFinish = () => ({
  type: types.authCheckingFinish,
});

export const StartLogin = (username, password) => {
  return async (dispatch) => {
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
          showConfirmButton: false,
          timer: 1500,
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
        Swal.fire("Error", body.msg || "Credenciales incorrectas", "error");
        dispatch(checkingFinish());
      }
    } catch (error) {
      console.error("Error en login:", error);
      let errorMessage = "Ha ocurrido un error";

      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        errorMessage = "Error de conexión con el servidor";
      } else if (error.message.includes("respuesta no es JSON")) {
        errorMessage = "Error interno del servidor";
      } else {
        errorMessage = error.message || errorMessage;
      }

      Swal.fire("Error", errorMessage, "error");
      dispatch(checkingFinish());
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
      showConfirmButton: false,
      timer: 1500,
    });
  };
};

const logout = () => ({ type: types.authLogout });

const login = (user) => ({
  type: types.authLogin,
  payload: user,
});
