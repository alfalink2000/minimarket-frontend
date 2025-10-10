// reducers/adminUsersReducer.js
import { types } from "../types/types";

const initialState = {
  users: [],
  activeUser: null,
  loading: false,
};

export const adminUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.adminUsersLoad:
      return {
        ...state,
        users: [...action.payload],
      };

    case types.adminUserSetActive:
      return {
        ...state,
        activeUser: action.payload,
      };

    case types.adminUserClearActive:
      return {
        ...state,
        activeUser: null,
      };

    case types.adminUserUpdated:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        ),
        activeUser: null,
      };

    case types.adminUserStatusToggled:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.userId
            ? { ...user, is_active: action.payload.isActive }
            : user
        ),
      };

    case types.adminUserDeleted:
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        activeUser: null,
      };

    default:
      return state;
  }
};
