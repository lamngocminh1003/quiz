import {
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_ERROR,
} from "../actions/categoryAction";
const INITIAL_STATE = {
  categories: [],
};
const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_SUCCESS:
      state.categories = action.data;
      return {
        ...state,
      };
    case FETCH_CATEGORY_ERROR:
      state.categories = [];
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default categoryReducer;
