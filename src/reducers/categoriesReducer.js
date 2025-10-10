// reducers/categoriesReducer.js
import { types } from "../types/types";

const initialState = {
  categories: [],
};

export const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.categoriesLoad:
      return {
        ...state,
        categories: [...action.payload],
      };

    case types.categoryAddNew:
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case types.categoryUpdated:
      return {
        ...state,
        categories: state.categories.map((category) =>
          category.name === action.payload.oldName
            ? { ...category, name: action.payload.newName }
            : category
        ),
      };

    case types.categoryDeleted:
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category.name !== action.payload
        ),
      };

    default:
      return state;
  }
};
