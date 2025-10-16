// types/types.js - VERSIÓN COMPLETA CON LOS TYPES QUE NECESITAS
export const types = {
  // ========== AUTH ==========
  authLogin: "[auth] Login",
  authLogout: "[auth] Logout",
  authCheckingFinish: "[auth] Finish checking login state",
  authStartLogin: "[auth] Start login",
  authStartRegister: "[auth] Start register",
  authStartTokenRenew: "[auth] Start token renew",
  authGetUsers: "[auth] Get users",

  // ✅ AGREGAR ESTOS TYPES QUE TU ACTION NECESITA
  authStartLoading: "[auth] Start loading",
  authFinishLoading: "[auth] Finish loading",

  // ========== PRODUCTS ==========
  productsLoad: "[products] Load products",
  productStartLoading: "[products] Start loading",
  productFinishLoading: "[products] Finish loading",
  productAddNew: "[products] Add new product",
  productUpdated: "[products] Updated product",
  productDeleted: "[products] Deleted product",
  productSetActive: "[products] Set active product",

  // ========== FEATURED PRODUCTS ==========
  productSetPopular: "[products] Set popular products",
  productSetOnSale: "[products] Set on sale products",
  productTogglePopular: "[products] Toggle popular product",
  productToggleOnSale: "[products] Toggle on sale product",

  // ========== CATEGORIES ==========
  categoriesLoad: "[categories] Load categories",
  categoryAddNew: "[categories] Add new category",
  categoryUpdated: "[categories] Updated category",
  categoryDeleted: "[categories] Deleted category",

  // ========== APP CONFIG ==========
  appConfigLoad: "[appConfig] Load app config",
  appConfigUpdate: "[appConfig] Update app config",

  // ========== ADMIN USERS ==========
  adminUsersLoad: "[adminUsers] Load admin users",
  adminUserAddNew: "[adminUsers] Add new admin user",
  adminUserUpdated: "[adminUsers] Updated admin user",
  adminUserDeleted: "[adminUsers] Deleted admin user",
  adminUserSetActive: "[adminUsers] Set active user",
  adminUserClearActive: "[adminUsers] Clear active user",
  adminUserStatusToggled: "[adminUsers] Status toggled",

  // ========== CART ==========
  cartAddItem: "[cart] Add item",
  cartRemoveItem: "[cart] Remove item",
  cartUpdateQuantity: "[cart] Update quantity",
  cartClear: "[cart] Clear cart",
  cartToggleModal: "[cart] Toggle modal",
};
