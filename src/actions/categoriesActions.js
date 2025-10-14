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
      const body = await fetchAPIConfig(
        `categories/delete/${categoryName}`,
        {},
        "DELETE"
      );

      if (body.ok) {
        dispatch({
          type: types.categoryDeleted,
          payload: categoryName,
        });
        Swal.fire("¡Éxito!", "Categoría eliminada correctamente", "success");
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("Error eliminando categoría:", error);
      Swal.fire("Error", "Error de conexión al eliminar la categoría", "error");
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
