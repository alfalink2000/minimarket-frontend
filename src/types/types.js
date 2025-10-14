// types/types.js - VERIFICAR QUE EXISTAN TODOS
export const types = {
  // Auth
  authLogin: "[auth] Login",
  authLogout: "[auth] Logout",
  authCheckingFinish: "[auth] Finish checking login state",
  authStartLogin: "[auth] Start login",
  authStartRegister: "[auth] Start register",
  authStartTokenRenew: "[auth] Start token renew",
  authGetUsers: "[auth] Get users",

  // Products
  productsLoad: "[products] Load products",
  productStartLoading: "[products] Start loading",
  productFinishLoading: "[products] Finish loading",
  productAddNew: "[products] Add new product",
  productUpdated: "[products] Updated product",
  productDeleted: "[products] Deleted product",
  productSetActive: "[products] Set active product",

  // Featured Products
  productSetPopular: "[products] Set popular products",
  productSetOnSale: "[products] Set on sale products",
  productTogglePopular: "[products] Toggle popular product",
  productToggleOnSale: "[products] Toggle on sale product",

  // Categories
  categoriesLoad: "[categories] Load categories",
  categoryAddNew: "[categories] Add new category",
  categoryUpdated: "[categories] Updated category",
  categoryDeleted: "[categories] Deleted category",

  // App Config
  appConfigLoad: "[appConfig] Load app config",
  appConfigUpdate: "[appConfig] Update app config",

  // Admin Users
  adminUsersLoad: "[adminUsers] Load admin users",
  adminUserAddNew: "[adminUsers] Add new admin user",
  adminUserUpdated: "[adminUsers] Updated admin user",
  adminUserDeleted: "[adminUsers] Deleted admin user",
};
