import { combineReducers } from "redux";
import fetchProductsReducer from "./fetchProductsReducer";

const rootReducer = combineReducers({
  products: fetchProductsReducer
});
export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;