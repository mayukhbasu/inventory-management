
import { Dispatch } from "redux";
import { Add_PRODUCTS_FROM_CART_FAILURE, Add_PRODUCTS_FROM_CART_REQUEST, 
  Add_PRODUCTS_FROM_CART_SUCCESS, 
  AddProductsForCartActionsType, 
  AddProductsForCartFailurePayload, AddProductsForCartSuccessPayload } 
  from "../types/addProductToCartTypes"
import axios from "axios";

type CachedProduct = {
  currentUser: string,
  selectedProducts: {
    [productID: string]: number
  }
}
const addProductFromCartRequest = (): AddProductsForCartActionsType => {
  return {
    type: Add_PRODUCTS_FROM_CART_REQUEST
  }
}

const addProductFromCartSuccess = (response: AddProductsForCartSuccessPayload): AddProductsForCartActionsType => {
  return {
    type: Add_PRODUCTS_FROM_CART_SUCCESS,
    payload: response
  }
}

const addProductFromCartFailure = (response: AddProductsForCartFailurePayload): AddProductsForCartActionsType => {
  return {
    type: Add_PRODUCTS_FROM_CART_FAILURE,
    payload: response
  }
}

export const addProductsToCart = (cachedProduct: CachedProduct) => async (dispatch: Dispatch<AddProductsForCartActionsType>) => {
  dispatch(addProductFromCartRequest());
  try {
    const response = await axios.post(`http://localhost:3000/inventory/addToCart`, cachedProduct, {withCredentials: true});
    return dispatch(addProductFromCartSuccess(response.data));
  } catch(err) {
    if(err instanceof Error) {
      dispatch(addProductFromCartFailure(err as any));
    }
  }
}