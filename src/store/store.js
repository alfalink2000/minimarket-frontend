// store/store.js - CONFIGURACIÓN CORRECTA PARA VITE
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";

// Importa todos tus reducers
import { productsReducer } from "../reducers/productsReducer";
import { categoriesReducer } from "../reducers/categoriesReducer";
import { authReducer } from "../reducers/authReducer";
import { adminUsersReducer } from "../reducers/adminUsersReducer";
import { appConfigReducer } from "../reducers/appConfigReducer";

// Combina los reducers
const reducers = combineReducers({
  products: productsReducer,
  categories: categoriesReducer,
  auth: authReducer,
  adminUsers: adminUsersReducer,
  appConfig: appConfigReducer,
});

// ✅ CONFIGURACIÓN CORRECTA para Redux DevTools con Vite
const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// Crea el store
export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);

// ✅ Para desarrollo - expone el store globalmente
if (import.meta.env.MODE === "development") {
  window.store = store;
}
