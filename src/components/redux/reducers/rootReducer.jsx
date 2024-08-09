import { combineReducers } from "redux";

import userReducer from "./userReducer";
import fileReducer from "./fileReducer";
import categoryReducer from "./categoryReducer";

const rootReducer = combineReducers({
  user: userReducer,
  file: fileReducer,
  category: categoryReducer,
});

export default rootReducer;
