import { fetchAPIConfig } from "../helpers/fetchAPIConfig";
import { fetchPublic } from "../helpers/fetchPublic";
import { types } from "../types/types";
import { applyTheme } from "../utils/themeManager";
import Swal from "sweetalert2";

// Cargar configuración
export const loadAppConfig = () => {
  return async (dispatch) => {
    try {
      console.log("🔄 Cargando configuración de la app...");

      const body = await fetchPublic("app-config/public");

      if (body.ok) {
        console.log("✅ Configuración cargada:", body.config);

        dispatch({
          type: types.appConfigLoad,
          payload: body.config,
        });

        applyTheme(body.config.theme);
      } else {
        console.error("Error en respuesta de configuración:", body.msg);
      }
    } catch (error) {
      console.error("Error de conexión cargando configuración:", error);
    }
  };
};

// Actualizar configuración
export const updateAppConfig = (configData) => {
  return async (dispatch) => {
    try {
      console.log("💾 Actualizando configuración...", configData);

      Swal.fire({
        title: "Guardando configuración...",
        text: "Por favor espera",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const body = await fetchAPIConfig("app-config", configData, "PUT");

      Swal.close();

      if (body.ok) {
        console.log("✅ Configuración actualizada exitosamente");

        await Swal.fire({
          icon: "success",
          title: "¡Configuración guardada!",
          text: "Los cambios se han aplicado correctamente",
          showConfirmButton: false,
          timer: 2000,
        });

        dispatch({
          type: types.appConfigUpdate,
          payload: body.config,
        });

        applyTheme(body.config.theme);

        return true;
      } else {
        console.error("Error en respuesta de actualización:", body.msg);
        Swal.fire(
          "Error",
          body.msg || "Error al guardar la configuración",
          "error"
        );
        return false;
      }
    } catch (error) {
      console.error("Error actualizando configuración:", error);
      Swal.fire(
        "Error",
        "Error de conexión al guardar la configuración",
        "error"
      );
      return false;
    }
  };
};

// Vista previa del tema
export const previewTheme = (themeName) => {
  return () => {
    console.log(`🎨 Aplicando vista previa del tema: ${themeName}`);
    applyTheme(themeName);
  };
};

// Resetear al tema guardado
export const resetTheme = () => {
  return (dispatch, getState) => {
    const currentTheme = getState().appConfig.config.theme;
    console.log(`🎨 Restableciendo al tema guardado: ${currentTheme}`);
    applyTheme(currentTheme);
  };
};

// Action sincrónica para setear configuración
export const setAppConfig = (config) => ({
  type: types.appConfigLoad,
  payload: config,
});
