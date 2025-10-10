// store/store.js - Versión para Vite
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { productsReducer } from "../reducers/productsReducer";
import { categoriesReducer } from "../reducers/categoriesReducer";
import { authReducer } from "../reducers/authReducer";
import { adminUsersReducer } from "../reducers/adminUsersReducer";
import { appConfigReducer } from "../reducers/appConfigReducer";

const reducers = combineReducers({
  products: productsReducer,
  categories: categoriesReducer,
  auth: authReducer,
  adminUsers: adminUsersReducer,
  appConfig: appConfigReducer,
});

// ✅ Configuración compatible con Vite
const composeEnhancers =
  (import.meta.env.MODE === "development" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
);

// ✅ Para desarrollo en Vite
if (import.meta.env.MODE === "development") {
  window.store = store;
}
