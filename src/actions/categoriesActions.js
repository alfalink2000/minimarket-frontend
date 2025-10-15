// actions/categoriesActions.js - COMPLETO
import { fetchAPIConfig } from "../helpers/fetchAPIConfig";
import { fetchPublic } from "../helpers/fetchPublic";
import { types } from "../types/types";
import Swal from "sweetalert2";

export const getCategories = () => {
  return async (dispatch, getState) => {
    // ✅ EVITAR CARGA DUPLICADA SI YA EXISTEN CATEGORÍAS
    if (getState().categories.categories.length > 0) {
      console.log("🔄 Categorías ya cargadas, omitiendo...");
      return Promise.resolve();
    }

    console.log("📂 Cargando categorías...");

    try {
      const body = await fetchPublic("categories/getCategories");

      if (body.ok) {
        console.log(
          `✅ ${body.categories.length} categorías cargadas exitosamente`
        );
        dispatch({
          type: types.categoriesLoad,
          payload: body.categories,
        });
        return Promise.resolve();
      } else {
        console.error("❌ Error en respuesta de categorías:", body.msg);
        return Promise.reject(
          new Error(body.msg || "Error cargando categorías")
        );
      }
    } catch (error) {
      console.error("❌ Error de conexión en getCategories:", error);
      return Promise.reject(error);
    }
  };
};

export const insertCategory = (categoryName) => {
  return async (dispatch) => {
    try {
      const body = await fetchAPIConfig(
        "categories/new",
        { name: categoryName },
        "POST"
      );

      if (body.ok) {
        dispatch({
          type: types.categoryAddNew,
          payload: body.category,
        });
        Swal.fire("¡Éxito!", "Categoría creada correctamente", "success");
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("Error insertando categoría:", error);
      Swal.fire("Error", "Error de conexión al crear la categoría", "error");
    }
  };
};

export const updateCategory = (oldName, newName) => {
  return async (dispatch) => {
    try {
      const body = await fetchAPIConfig(
        `categories/update/${oldName}`,
        { newName },
        "PUT"
      );

      if (body.ok) {
        dispatch({
          type: types.categoryUpdated,
          payload: { oldName, newName },
        });
        Swal.fire("¡Éxito!", "Categoría actualizada correctamente", "success");
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      Swal.fire(
        "Error",
        "Error de conexión al actualizar la categoría",
        "error"
      );
    }
  };
};

export const deleteCategory = (categoryName) => {
  return async (dispatch) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        html: `Vas a eliminar la categoría: <strong>"${categoryName}"</strong>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;

      const body = await fetchAPIConfig(
        `categories/delete/${encodeURIComponent(categoryName)}`,
        {},
        "DELETE"
      );

      if (body.ok) {
        dispatch({ type: types.categoryDeleted, payload: categoryName });
        Swal.fire(
          "¡Eliminada!",
          "Categoría eliminada correctamente",
          "success"
        );
      } else {
        // ✅ DETECTAR SI ES POR PRODUCTOS ASOCIADOS
        const errorMsg = body.msg?.toLowerCase() || "";
        const hasProducts =
          errorMsg.includes("producto") ||
          errorMsg.includes("asociado") ||
          body.status === 400;

        if (hasProducts) {
          Swal.fire({
            icon: "error",
            title: "No se puede eliminar",
            html: `
              <div style="text-align: center;">
                <p>La categoría <strong>"${categoryName}"</strong> contiene productos.</p>
                <p style="color: #6b7280; font-size: 0.9rem; margin-top: 10px;">
                  ⚠️ Elimina o reasigna los productos antes de eliminar la categoría.
                </p>
              </div>
            `,
            confirmButtonText: "Entendido",
          });
        } else {
          Swal.fire("Error", body.msg || "Error al eliminar", "error");
        }
      }
    } catch (error) {
      console.error("Error eliminando categoría:", error);

      // ✅ DETECTAR ERROR 400 EN EL CATCH
      if (error.message?.includes("400")) {
        Swal.fire({
          icon: "error",
          title: "No se puede eliminar",
          html: `La categoría <strong>"${categoryName}"</strong> tiene productos asociados. Elimina los productos primero.`,
          confirmButtonText: "Entendido",
        });
      } else {
        Swal.fire("Error", "Error de conexión", "error");
      }
    }
  };
};

// Action creators sincrónicos (sin cambios)
const loadCategories = (categories) => ({
  type: types.categoriesLoad,
  payload: categories,
});

const addNewCategory = (category) => ({
  type: types.categoryAddNew,
  payload: category,
});

const updateCategoryAction = ({ oldName, newName }) => ({
  type: types.categoryUpdated,
  payload: { oldName, newName },
});

const deleteCategoryAction = (categoryName) => ({
  type: types.categoryDeleted,
  payload: categoryName,
});
