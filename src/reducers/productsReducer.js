// reducers/productsReducer.js
import { types } from "../types/types";

const initialState = {
  products: [],
  activeProduct: null,
  loading: false,
  lastUpdate: null, // 🔄 NUEVO: trackear última actualización
  featuredProducts: {
    popular: [], // IDs de productos populares
    onSale: [], // IDs de productos en oferta
  },
};

export const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.productsLoad:
      return {
        ...state,
        products: [...action.payload],
        lastUpdate: Date.now(), // 🔄 ACTUALIZAR TIMESTAMP
      };

    case types.productAddNew:
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case types.productUpdated:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        lastUpdate: Date.now(),
      };

    case types.productDeleted:
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
        featuredProducts: {
          popular: state.featuredProducts.popular.filter(
            (id) => id !== action.payload
          ),
          onSale: state.featuredProducts.onSale.filter(
            (id) => id !== action.payload
          ),
        },
      };

    case types.productSetActive:
      return {
        ...state,
        activeProduct: action.payload,
      };

    case types.productStartLoading:
      return {
        ...state,
        loading: true,
      };

    case types.productFinishLoading:
      return {
        ...state,
        loading: false,
      };

    // Nuevos casos para productos destacados
    case types.productSetPopular:
      return {
        ...state,
        featuredProducts: {
          ...state.featuredProducts,
          popular: action.payload,
        },
      };

    case types.productSetOnSale:
      return {
        ...state,
        featuredProducts: {
          ...state.featuredProducts,
          onSale: action.payload,
        },
      };

    case types.productTogglePopular:
      const productId = action.payload;
      const isCurrentlyPopular =
        state.featuredProducts.popular.includes(productId);

      return {
        ...state,
        featuredProducts: {
          ...state.featuredProducts,
          popular: isCurrentlyPopular
            ? state.featuredProducts.popular.filter((id) => id !== productId)
            : [...state.featuredProducts.popular, productId],
        },
      };

    case types.productToggleOnSale:
      const saleProductId = action.payload;
      const isCurrentlyOnSale =
        state.featuredProducts.onSale.includes(saleProductId);

      return {
        ...state,
        featuredProducts: {
          ...state.featuredProducts,
          onSale: isCurrentlyOnSale
            ? state.featuredProducts.onSale.filter((id) => id !== saleProductId)
            : [...state.featuredProducts.onSale, saleProductId],
        },
      };

    default:
      return state;
  }
};
