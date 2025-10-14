// reducers/authReducer.js - VERSIÓN COMPATIBLE
import { types } from "../types/types";

const initialState = {
  checking: true,
  loading: false,
  uid: null,
  name: null,
  isLoggedIn: false,
};

export const authReducer = (state = initialState, action) => {
  // ✅ VERIFICACIÓN DE SEGURIDAD
  if (!action || !action.type) {
    console.warn("⚠️ Action sin type en authReducer:", action);
    return state;
  }

  switch (action.type) {
    case types.authStartLogin: // ✅ MANEJAR authStartLogin COMO LOADING
    case types.authStartLoading: // ✅ TAMBIÉN MANEJAR authStartLoading POR SI ACASO
      return {
        ...state,
        loading: true,
      };

    case types.authLogin:
      return {
        ...state,
        checking: false,
        loading: false,
        uid: action.payload.uid,
        name: action.payload.name,
        isLoggedIn: true,
      };

    case types.authCheckingFinish:
    case types.authFinishLoading: // ✅ TAMBIÉN MANEJAR authFinishLoading
      return {
        ...state,
        checking: false,
        loading: false,
      };

    case types.authLogout:
      return {
        checking: false,
        loading: false,
        uid: null,
        name: null,
        isLoggedIn: false,
      };

    default:
      return state;
  }
};
