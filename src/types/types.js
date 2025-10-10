export const types = {
  // Auth - VERIFICAR QUE ESTOS NOMBRES COINCIDAN EXACTAMENTE
  authLogin: "[auth] Login",
  authLogout: "[auth] Logout",
  authCheckingFinish: "[auth] Finish checking login state",

  // Admin Users Types
  adminUsersLoad: "[Admin Users] Load users",
  adminUserSetActive: "[Admin Users] Set active user",
  adminUserClearActive: "[Admin Users] Clear active user",
  adminUserUpdated: "[Admin Users] User updated",
  adminUserStatusToggled: "[Admin Users] User status toggled",
  adminUserDeleted: "[Admin Users] User deleted",

  // Products
  productsLoad: "[products] Load products",
  productStartLoading: "[products] Start loading",
  productFinishLoading: "[products] Finish loading",
  productAddNew: "[products] Add new product",
  productUpdated: "[products] Update product",
  productDeleted: "[products] Delete product",
  productSetActive: "[products] Set active product",

  // Productos destacados
  productSetPopular: "[Products] Set Popular Products",
  productSetOnSale: "[Products] Set On Sale Products",
  productTogglePopular: "[Products] Toggle Popular Product",
  productToggleOnSale: "[Products] Toggle On Sale Product",

  // Categories
  categoriesLoad: "[categories] Load categories",
  categoriesStartLoading: "[categories] Start loading",
  categoriesFinishLoading: "[categories] Finish loading",

  // App Config
  appConfigLoad: "[App Config] Load config",
  appConfigUpdate: "[App Config] Update config",
  appConfigSetColors: "[App Config] Set colors",
};
