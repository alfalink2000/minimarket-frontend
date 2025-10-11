import { fetchAPIConfig } from "../helpers/fetchAPIConfig";
import { fetchPublic } from "../helpers/fetchPublic";
import { types } from "../types/types";
import Swal from "sweetalert2";

export const getProducts = (forceRefresh = false) => {
  return async (dispatch, getState) => {
    if (!forceRefresh && getState().products.products.length > 0) {
      const lastUpdate = getState().products.lastUpdate;
      const now = Date.now();
      if (lastUpdate && now - lastUpdate < 10000) {
        return;
      }
    }

    dispatch(startLoading());

    try {
      const body = await fetchPublic("products/getProducts");

      if (body.ok) {
        dispatch(loadProducts(body.products));
      } else {
        console.error("Error en respuesta de productos:", body.msg);
      }
    } catch (error) {
      console.error("Error de conexión en getProducts:", error);
    } finally {
      dispatch(finishLoading());
    }
  };
};

export const insertProduct = (formData) => {
  return async (dispatch) => {
    try {
      Swal.fire({
        title: "Subiendo imagen...",
        text: "Por favor espera",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const body = await fetchAPIConfig("products/new", formData, "POST", true);

      Swal.close();

      if (body.ok) {
        dispatch(addNewProduct(body.product));
        Swal.fire({
          icon: "success",
          title: "¡Producto agregado!",
          text: "Producto registrado correctamente",
        });
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("Error insertando producto:", error);
      Swal.fire("Error", "Error de conexión al crear el producto", "error");
    }
  };
};

export const updateProduct = (formData) => {
  return async (dispatch) => {
    try {
      Swal.fire({
        title: "Actualizando producto...",
        text: "Por favor espera",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const productId = formData.get("id");

      console.log("🚀 Enviando al servidor:", {
        id: productId,
        status: formData.get("status"),
        stock_quantity: formData.get("stock_quantity"),
      });

      const body = await fetchAPIConfig(
        `products/update/${productId}`,
        formData,
        "PUT",
        true
      );

      console.log("📥 Respuesta del servidor:", body);

      Swal.close();

      if (body.ok) {
        dispatch(updateProductAction(body.product));

        setTimeout(() => {
          console.log("🔄 Forzando refresh de productos...");
          dispatch(getProducts(true));
        }, 1000);

        Swal.fire(
          "¡Actualización exitosa!",
          "Producto actualizado correctamente",
          "success"
        );
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("Error actualizando producto:", error);
      Swal.fire(
        "Error",
        "Error de conexión al actualizar el producto",
        "error"
      );
    }
  };
};

export const refreshProductsIfNeeded = () => {
  return async (dispatch, getState) => {
    const lastUpdate = getState().products.lastUpdate;
    const now = Date.now();

    if (!lastUpdate || now - lastUpdate > 30000) {
      dispatch(getProducts());
    }
  };
};

export const deleteProduct = (id) => {
  return async (dispatch) => {
    const body = await fetchAPIConfig(`products/delete/${id}`, {}, "DELETE");

    if (body.ok) {
      dispatch(deleteProductAction(id));
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
    } else {
      Swal.fire("Error", body.msg, "error");
    }
  };
};

export const setActiveProduct = (product) => ({
  type: types.productSetActive,
  payload: product,
});

// Action creators sincrónicos
const startLoading = () => ({ type: types.productStartLoading });
const finishLoading = () => ({ type: types.productFinishLoading });
const loadProducts = (products) => ({
  type: types.productsLoad,
  payload: products,
});

const addNewProduct = (product) => ({
  type: types.productAddNew,
  payload: product,
});

const updateProductAction = (product) => ({
  type: types.productUpdated,
  payload: product,
});

const deleteProductAction = (id) => ({
  type: types.productDeleted,
  payload: id,
});
