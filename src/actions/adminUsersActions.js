// actions/adminUsersActions.js
import { fetchAPIConfig } from "../helpers/fetchAPIConfig";
import { types } from "../types/types";
import Swal from "sweetalert2";

export const getAdminUsers = () => {
  return async (dispatch) => {
    try {
      const resp = await fetchAPIConfig("auth/getUsers", {}, "GET");
      const body = await resp.json();

      if (body.ok) {
        dispatch(loadAdminUsers(body.usuarios));
      } else {
        Swal.fire("Error", body.msg || "Error al cargar usuarios", "error");
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      Swal.fire("Error", "Error de conexión al cargar usuarios", "error");
    }
  };
};

export const updateAdminUser = (userData) => {
  return async (dispatch) => {
    try {
      Swal.fire({
        title: "Actualizando usuario...",
        text: "Por favor espera",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // ✅ DEBUG: Ver qué datos se envían
      console.log("🚀 Enviando datos al servidor:", userData);

      // Preparar los datos para el backend
      const updateData = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
      };

      // Solo incluir campos de contraseña si se proporcionaron
      if (userData.password_user && userData.new_password) {
        updateData.password_user = userData.password_user;
        updateData.new_password = userData.new_password;
        console.log("🔐 Incluyendo campos de contraseña");
      } else {
        console.log("🔓 Actualizando solo datos básicos (sin contraseña)");
      }

      const resp = await fetchAPIConfig("auth/update", updateData, "PUT");

      // ✅ DEBUG: Ver respuesta del servidor
      console.log("📡 Respuesta del servidor:", resp.status, resp.statusText);

      const body = await resp.json();
      console.log("📦 Body de respuesta:", body);

      Swal.close();

      if (body.ok) {
        dispatch(
          updateAdminUserAction({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            full_name: userData.full_name,
          })
        );
        Swal.fire({
          icon: "success",
          title: "¡Usuario actualizado!",
          text: "Usuario actualizado correctamente",
        });
        return true;
      } else {
        Swal.fire("Error", body.msg, "error");
        return false;
      }
    } catch (error) {
      console.error("❌ Error actualizando usuario:", error);
      Swal.fire("Error", "Error de conexión al actualizar usuario", "error");
      return false;
    }
  };
};

export const toggleUserStatus = (userId, currentStatus) => {
  return async (dispatch, getState) => {
    try {
      const { adminUsers } = getState();
      const newStatus = !currentStatus;

      // Verificar en el frontend también que no sea el último usuario activo
      if (!newStatus) {
        const activeUsersCount = adminUsers.users.filter(
          (user) => user.is_active
        ).length;
        if (activeUsersCount <= 1) {
          Swal.fire(
            "Error",
            "No se puede desactivar el último usuario activo",
            "error"
          );
          return false;
        }
      }

      const resp = await fetchAPIConfig(
        `auth/toggle-status/${userId}`, // ← Cambiar la ruta
        { is_active: newStatus },
        "PUT"
      );

      // Verificar si la respuesta es OK
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Error HTTP: ${resp.status} - ${errorText}`);
      }

      const body = await resp.json();

      if (body.ok) {
        dispatch(toggleUserStatusAction(userId, newStatus));
        Swal.fire({
          icon: "success",
          title: `Usuario ${newStatus ? "activado" : "desactivado"}`,
          text: `Usuario ${
            newStatus ? "activado" : "desactivado"
          } correctamente`,
        });
        return true;
      } else {
        Swal.fire("Error", body.msg, "error");
        return false;
      }
    } catch (error) {
      console.error("Error cambiando estado de usuario:", error);
      Swal.fire("Error", "Error de conexión", "error");
      return false;
    }
  };
};

export const deleteAdminUser = (userId) => {
  return async (dispatch, getState) => {
    const { adminUsers } = getState();

    // Verificar en el frontend que no sea el último usuario
    if (adminUsers.users.length <= 1) {
      Swal.fire("Error", "No se puede eliminar el último usuario", "error");
      return false;
    }

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return false;

    try {
      const resp = await fetchAPIConfig(
        `auth/delete/${userId}`, // ← Cambiar la ruta
        {},
        "DELETE"
      );

      // Verificar si la respuesta es OK
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Error HTTP: ${resp.status} - ${errorText}`);
      }

      const body = await resp.json();

      if (body.ok) {
        dispatch(deleteAdminUserAction(userId));
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
        return true;
      } else {
        Swal.fire("Error", body.msg, "error");
        return false;
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      Swal.fire("Error", "Error de conexión al eliminar usuario", "error");
      return false;
    }
  };
};

// Action creators sincrónicos
const loadAdminUsers = (users) => ({
  type: types.adminUsersLoad,
  payload: users,
});

const updateAdminUserAction = (userData) => ({
  type: types.adminUserUpdated,
  payload: userData,
});

const toggleUserStatusAction = (userId, isActive) => ({
  type: types.adminUserStatusToggled,
  payload: { userId, isActive },
});

const deleteAdminUserAction = (userId) => ({
  type: types.adminUserDeleted,
  payload: userId,
});

export const setActiveAdminUser = (user) => ({
  type: types.adminUserSetActive,
  payload: user,
});

export const clearActiveAdminUser = () => ({
  type: types.adminUserClearActive,
});
