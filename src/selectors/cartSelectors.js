// selectors/cartSelectors.js
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemsCount = (state) => state.cart.itemsCount;
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
