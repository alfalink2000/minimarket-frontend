import { fetchAPIConfig } from "../helpers/fetchAPIConfig";
import { fetchPublic } from "../helpers/fetchPublic";
import { types } from "../types/types";
import Swal from "sweetalert2";

// Obtener productos destacados del backend
export const getFeaturedProducts = () => {
  return async (dispatch) => {
    try {
      const body = await fetchAPIConfig("featured-products");

      if (body.ok) {
        dispatch(setPopularProducts(body.popular || []));
        dispatch(setOnSaleProducts(body.onSale || []));
        console.log("✅ Productos destacados cargados:", {
          popular: body.popular.length,
          onSale: body.onSale.length,
        });
      } else {
        console.error("Error loading featured products:", body.msg);
        dispatch(setPopularProducts([]));
        dispatch(setOnSaleProducts([]));
      }
    } catch (error) {
      console.error("Error cargando productos destacados:", error);
      dispatch(setPopularProducts([]));
      dispatch(setOnSaleProducts([]));
    }
  };
};

// Guardar productos destacados en el backend
export const saveFeaturedProducts = (featuredData) => {
  return async (dispatch) => {
    try {
      console.log("💾 Guardando productos destacados...", featuredData);

      Swal.fire({
        title: "Guardando...",
        text: "Actualizando productos destacados",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const body = await fetchAPIConfig(
        "featured-products",
        featuredData,
        "POST"
      );

      Swal.close();

      if (body.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Guardado!",
          text: "Productos destacados actualizados correctamente",
          timer: 2000,
          showConfirmButton: false,
        });

        dispatch(setPopularProducts(body.popular));
        dispatch(setOnSaleProducts(body.onSale));
      } else {
        Swal.fire("Error", body.msg, "error");
      }
    } catch (error) {
      console.error("Error guardando productos destacados:", error);
      Swal.fire("Error", "Error de conexión al guardar", "error");
    }
  };
};

// Toggle individual (solo en frontend)
export const toggleProductPopular = (productId) => ({
  type: types.productTogglePopular,
  payload: productId,
});

export const toggleProductOnSale = (productId) => ({
  type: types.productToggleOnSale,
  payload: productId,
});

// Guardar automáticamente después de cambios
export const toggleProductPopularAndSave = (productId) => {
  return async (dispatch, getState) => {
    dispatch(toggleProductPopular(productId));

    const state = getState();
    setTimeout(() => {
      dispatch(
        saveFeaturedProducts({
          popular: state.products.featuredProducts.popular,
          onSale: state.products.featuredProducts.onSale,
        })
      );
    }, 300);
  };
};

export const toggleProductOnSaleAndSave = (productId) => {
  return async (dispatch, getState) => {
    dispatch(toggleProductOnSale(productId));

    const state = getState();
    setTimeout(() => {
      dispatch(
        saveFeaturedProducts({
          popular: state.products.featuredProducts.popular,
          onSale: state.products.featuredProducts.onSale,
        })
      );
    }, 300);
  };
};

// Setters para cargar desde backend
export const setPopularProducts = (productIds) => ({
  type: types.productSetPopular,
  payload: productIds,
});

export const setOnSaleProducts = (productIds) => ({
  type: types.productSetOnSale,
  payload: productIds,
});

// CARGAR productos destacados desde el backend (RUTA PÚBLICA)
export const loadFeaturedProducts = () => {
  return async (dispatch) => {
    try {
      console.log("🔄 Cargando productos destacados desde el backend...");

      const body = await fetchPublic("featured-products/public");

      if (body.ok) {
        console.log("✅ Productos destacados cargados:", {
          popular: body.popular.length,
          onSale: body.onSale.length,
        });
        dispatch(setPopularProducts(body.popular));
        dispatch(setOnSaleProducts(body.onSale));
      } else {
        console.error("Error en respuesta de productos destacados:", body.msg);
      }
    } catch (error) {
      console.error("Error de conexión cargando productos destacados:", error);
    }
  };
};
