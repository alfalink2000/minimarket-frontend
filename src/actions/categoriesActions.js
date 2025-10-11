import { fetchAPIConfig } from "../helpers/fetchAPIConfig";
import { fetchPublic } from "../helpers/fetchPublic";
import { types } from "../types/types";
import Swal from "sweetalert2";

export const getCategories = () => {
  return async (dispatch) => {
    try {
      const body = await fetchPublic("categories/getCategories");

      if (body.ok) {
        dispatch(loadCategories(body.categories));
      } else {
        console.error("Error en respuesta de categorías:", body.msg);
      }
    } catch (error) {
      console.error("Error de conexión en getCategories:", error);
    }
  };
};

export const insertCategory = (categoryName) => {
  return async (dispatch) => {
    const body = await fetchAPIConfig(
      "categories/new",
      { name: categoryName },
      "POST"
    );

    if (body.ok) {
      dispatch(addNewCategory(body.category));
      Swal.fire({
        icon: "success",
        title: "¡Categoría agregada!",
        text: "Categoría creada correctamente",
      });
    } else {
      Swal.fire("Error", body.msg, "error");
    }
  };
};

export const updateCategory = (oldName, newName) => {
  return async (dispatch) => {
    const body = await fetchAPIConfig(
      "categories/update",
      { oldName, newName },
      "PUT"
    );

    if (body.ok) {
      dispatch(updateCategoryAction({ oldName, newName }));
      Swal.fire({
        icon: "success",
        title: "¡Categoría actualizada!",
        text: "Categoría renombrada correctamente",
      });
    } else {
      Swal.fire("Error", body.msg, "error");
    }
  };
};

export const deleteCategory = (categoryName) => {
  return async (dispatch) => {
    const body = await fetchAPIConfig(
      `categories/delete/${categoryName}`,
      {},
      "DELETE"
    );

    if (body.ok) {
      dispatch(deleteCategoryAction(categoryName));
      Swal.fire("Eliminada", "Categoría eliminada correctamente", "success");
    } else {
      Swal.fire("Error", body.msg, "error");
    }
  };
};

// Action creators sincrónicos
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
