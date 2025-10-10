// src/selectors/productSelectors.js
import { createSelector } from "reselect";

// Selectores básicos
const selectProductsState = (state) => state.products;
const selectCategoriesState = (state) => state.categories;

// Selector memoizado para productos
export const selectProducts = createSelector(
  [selectProductsState],
  (productsState) => productsState.products
);

// Selector memoizado para featured products
export const selectFeaturedProducts = createSelector(
  [selectProductsState],
  (productsState) =>
    productsState.featuredProducts || { popular: [], onSale: [] }
);

// Selector memoizado para categorías
export const selectCategories = createSelector(
  [selectCategoriesState],
  (categoriesState) => categoriesState.categories
);

// Selector memoizado para productos populares
export const selectPopularProducts = createSelector(
  [selectProducts, selectFeaturedProducts],
  (products, featuredProducts) => {
    const featuredIds = featuredProducts.popular || [];
    return products.filter((product) => featuredIds.includes(product.id));
  }
);

// Selector memoizado para productos en oferta
export const selectOfferProducts = createSelector(
  [selectProducts, selectFeaturedProducts],
  (products, featuredProducts) => {
    const featuredIds = featuredProducts.onSale || [];
    return products.filter((product) => featuredIds.includes(product.id));
  }
);

// Selector memoizado para opciones de categorías
export const selectCategoryOptions = createSelector(
  [selectCategories],
  (categories) => {
    const options = ["Todos"];
    if (Array.isArray(categories)) {
      categories.forEach((category) => {
        if (category?.name && !options.includes(category.name)) {
          options.push(category.name);
        }
      });
    }
    return options;
  }
);
