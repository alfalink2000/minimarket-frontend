// actions/categories.js - VERSIÓN CON DEBUG
import { fetchAPIConfig } from "../helpers/fetchAPIConfig";
import { fetchPublic } from "../helpers/fetchPublic";
import { types } from "../types/types";
import Swal from "sweetalert2";

export const getCategories = () => {
  return async (dispatch) => {
    try {
      console.log("🔄 [DEBUG] getCategories - Iniciando...");
      const body = await fetchPublic("categories/getCategories");
      console.log("📦 [DEBUG] getCategories - Respuesta:", body);

      if (body.ok) {
        console.log(
          "✅ [DEBUG] getCategories - Éxito, categorías:",
          body.categories
        );
        dispatch(loadCategories(body.categories));
      } else {
        console.error(
          "❌ [DEBUG] getCategories - Error en respuesta:",
          body.msg
        );
      }
    } catch (error) {
      console.error("❌ [DEBUG] getCategories - Error de conexión:", error);
    }
  };
};

export const insertCategory = (categoryName) => {
  return async (dispatch) => {
    try {
      console.log(
        "🔄 [DEBUG] insertCategory - Intentando crear:",
        categoryName
      );

      const body = await fetchAPIConfig(
        "categories/new",
        { name: categoryName },
        "POST"
      );

      console.log("📦 [DEBUG] insertCategory - Respuesta:", body);

      if (body.ok) {
        console.log(
          "✅ [DEBUG] insertCategory - Éxito, categoría creada:",
          body.category
        );
        dispatch(addNewCategory(body.category));
        Swal.fire({
          icon: "success",
          title: "¡Categoría agregada!",
          text: "Categoría creada correctamente",
        });
      } else {
        console.error("❌ [DEBUG] insertCategory - Error:", body.msg);
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("❌ [DEBUG] insertCategory - Error de conexión:", error);
      Swal.fire("Error", "Error de conexión al crear categoría", "error");
    }
  };
};

export const updateCategory = (oldName, newName) => {
  return async (dispatch) => {
    try {
      console.log("🔄 [DEBUG] updateCategory - Intentando actualizar:", {
        oldName,
        newName,
      });

      const body = await fetchAPIConfig(
        "categories/update",
        { oldName, newName },
        "PUT"
      );

      console.log("📦 [DEBUG] updateCategory - Respuesta:", body);

      if (body.ok) {
        console.log("✅ [DEBUG] updateCategory - Éxito, categoría actualizada");
        dispatch(updateCategoryAction({ oldName, newName }));
        Swal.fire({
          icon: "success",
          title: "¡Categoría actualizada!",
          text: "Categoría renombrada correctamente",
        });
      } else {
        console.error("❌ [DEBUG] updateCategory - Error:", body.msg);
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("❌ [DEBUG] updateCategory - Error de conexión:", error);
      Swal.fire("Error", "Error de conexión al actualizar categoría", "error");
    }
  };
};

// actions/categories.js - ELIMINAR LA CONFIRMACIÓN DUPLICADA
// actions/categories.js - CONFIRMACIÓN EN LA ACTION
export const deleteCategory = (categoryName) => {
  return async (dispatch) => {
    // ✅ La confirmación va aquí
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      console.log("❌ [DEBUG] deleteCategory - Cancelado por el usuario");
      return;
    }

    try {
      console.log("🔄 [DEBUG] deleteCategory - Eliminando:", categoryName);

      const body = await fetchAPIConfig(
        `categories/delete/${categoryName}`,
        {},
        "DELETE"
      );

      console.log("📦 [DEBUG] deleteCategory - Respuesta:", body);

      if (body.ok) {
        console.log("✅ [DEBUG] deleteCategory - Éxito, categoría eliminada");
        dispatch(deleteCategoryAction(categoryName));
        Swal.fire("Eliminada", "Categoría eliminada correctamente", "success");
      } else {
        console.error("❌ [DEBUG] deleteCategory - Error:", body.msg);
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("❌ [DEBUG] deleteCategory - Error de conexión:", error);
      Swal.fire("Error", "Error de conexión al eliminar categoría", "error");
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
