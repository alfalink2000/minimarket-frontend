import { types } from "../types/types";

const initialState = {
  checking: true,
  loading: false, // ✅ AGREGAR ESTA LÍNEA
  uid: null,
  name: null,
  isLoggedIn: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.authStartLoading: // ✅ AGREGAR ESTE CASE
      return {
        ...state,
        loading: true,
      };

    case types.authFinishLoading: // ✅ AGREGAR ESTE CASE
      return {
        ...state,
        loading: false,
      };

    case types.authLogin:
      return {
        ...state,
        checking: false,
        loading: false, // ✅ AGREGAR ESTA LÍNEA
        uid: action.payload.uid,
        name: action.payload.name,
        isLoggedIn: true,
      };

    case types.authCheckingFinish:
      return {
        ...state,
        checking: false,
      };

    case types.authLogout:
      return {
        checking: false,
        loading: false, // ✅ AGREGAR ESTA LÍNEA
        uid: null,
        name: null,
        isLoggedIn: false,
      };

    default:
      return state;
  }
};
