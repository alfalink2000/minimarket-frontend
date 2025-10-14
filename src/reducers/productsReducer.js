// reducers/productsReducer.js
import { types } from "../types/types";

const initialState = {
  products: [],
  featuredProducts: {
    popular: [],
    onSale: [],
  },
  loading: false,
  lastUpdate: null,
};

export const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    // ✅ Manejar acciones básicas de productos
    case types.productsLoad:
      return {
        ...state,
        products: [...action.payload],
        lastUpdate: Date.now(),
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
      };

    case types.productDeleted:
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };

    case types.productSetActive:
      return {
        ...state,
        activeProduct: action.payload,
      };

    // ✅ Manejar acciones de featured products (aunque no las uses)
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
      const isPopular = state.featuredProducts.popular.includes(action.payload);
      return {
        ...state,
        featuredProducts: {
          ...state.featuredProducts,
          popular: isPopular
            ? state.featuredProducts.popular.filter(
                (id) => id !== action.payload
              )
            : [...state.featuredProducts.popular, action.payload],
        },
      };

    case types.productToggleOnSale:
      const isOnSale = state.featuredProducts.onSale.includes(action.payload);
      return {
        ...state,
        featuredProducts: {
          ...state.featuredProducts,
          onSale: isOnSale
            ? state.featuredProducts.onSale.filter(
                (id) => id !== action.payload
              )
            : [...state.featuredProducts.onSale, action.payload],
        },
      };

    default:
      return state;
  }
};
