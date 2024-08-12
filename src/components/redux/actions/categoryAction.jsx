import { toast } from "react-toastify";
import { fetchAllCategories } from "../../../services/categoryService";

export const FETCH_CATEGORY = "FETCH_CATEGORY";
export const FETCH_CATEGORY_SUCCESS = "FETCH_CATEGORY_SUCCESS";
export const FETCH_CATEGORY_ERROR = "FETCH_CATEGORY_ERROR";

export const fetchCategoryStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await fetchAllCategories();
      if (res && res.data.errCode === 1) {
        dispatch(fetchCategorySuccess(res.data.DT));
      } else {
        dispatch(fetchCategoryFailed());
      }
    } catch (e) {
      dispatch(fetchCategoryFailed());
    }
  };
};

export const fetchCategorySuccess = (categoryData) => ({
  type: FETCH_CATEGORY_SUCCESS,
  data: categoryData,
});

export const fetchCategoryFailed = () => ({
  type: FETCH_CATEGORY_ERROR,
});
