// store/store.js - CON REDUX PERSIST
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
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

// ✅ CONFIGURACIÓN DE PERSISTENCIA
const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["products", "categories", "appConfig", "cart"], // Qué datos persistir
  timeout: 5000,
  version: 1, // Versión para migraciones futuras
};

const persistedReducer = persistReducer(persistConfig, reducers);

// ✅ MIDDLEWARE DE DEBUG MEJORADO
const debugMiddleware = (store) => (next) => (action) => {
  // Solo log actions importantes para no saturar la consola
  const importantActions = [
    "LOAD_APP_CONFIG",
    "GET_PRODUCTS",
    "GET_CATEGORIES",
    "LOAD_APP_CONFIG_SUCCESS",
    "GET_PRODUCTS_SUCCESS",
    "GET_CATEGORIES_SUCCESS",
    "LOAD_APP_CONFIG_FAILURE",
    "GET_PRODUCTS_FAILURE",
    "GET_CATEGORIES_FAILURE",
  ];

  if (importantActions.includes(action.type)) {
    console.group(`🔍 REDUX ACTION: ${action.type}`);
    console.log("Payload:", action.payload);
    console.log("State antes:", store.getState());
    const result = next(action);
    console.log("State después:", store.getState());
    console.groupEnd();
    return result;
  }

  return next(action);
};

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk, debugMiddleware))
);

export const persistor = persistStore(store);

// Para debug en desarrollo
if (import.meta.env.MODE === "development") {
  window.store = store;
  window.persistor = persistor;
}
