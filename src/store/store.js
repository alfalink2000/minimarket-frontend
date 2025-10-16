// store/store.js - CON DEBUG EXTENDIDO
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { productsReducer } from "../reducers/productsReducer";
import { categoriesReducer } from "../reducers/categoriesReducer";
import { authReducer } from "../reducers/authReducer";
import { adminUsersReducer } from "../reducers/adminUsersReducer";
import { appConfigReducer } from "../reducers/appConfigReducer";
import { cartReducer } from "../reducers/cartReducer";

const reducers = combineReducers({
  products: productsReducer,
  categories: categoriesReducer,
  auth: authReducer,
  adminUsers: adminUsersReducer,
  appConfig: appConfigReducer,
  cart: cartReducer,
});

// ✅ MIDDLEWARE DE DEBUG PARA ENCONTRAR LA ACCIÓN PROBLEMÁTICA
const debugMiddleware = (store) => (next) => (action) => {
  // Capturar TODAS las acciones para debug
  console.group("🔍 REDUX ACTION DISPATCHED");
  console.log("Action Type:", action.type);
  console.log("Action Payload:", action.payload);
  console.trace("Stack trace:"); // Esto te dirá exactamente de dónde viene
  console.groupEnd();

  try {
    return next(action);
  } catch (error) {
    console.error("❌ ERROR en reducer para acción:", action.type, error);
    throw error;
  }
};

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk, debugMiddleware))
);

if (import.meta.env.MODE === "development") {
  window.store = store;
}
