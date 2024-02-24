import { combineReducers } from "redux";
import fetchProductsReducer from "./fetchProductsReducer";
import userInfoReducer from "./userInfoReducer";

const rootReducer = combineReducers({
  products: fetchProductsReducer,
  userInfo: userInfoReducer
});
export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;