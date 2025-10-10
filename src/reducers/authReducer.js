import { types } from "../types/types";

const initialState = {
  checking: true,
  uid: null,
  name: null,
  isLoggedIn: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.authLogin:
      return {
        ...state,
        checking: false,
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
        uid: null,
        name: null,
        isLoggedIn: false,
      };

    default:
      return state;
  }
};
