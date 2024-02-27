import { AddProductsForCartActionsType, AddProductsForCartSuccessPayload, Add_PRODUCTS_FROM_CART_FAILURE, Add_PRODUCTS_FROM_CART_REQUEST, Add_PRODUCTS_FROM_CART_SUCCESS } from "../types/addProductToCartTypes"

type addItemsToCartResponse = {
  loading: boolean,
  data: AddProductsForCartSuccessPayload,
  error: any
}

const initialState: addItemsToCartResponse = {
  loading: false,
  data: {
    status: "",
    message: false
  },
  error: undefined
}

const addItemsToCartReducer = (state = initialState, action: AddProductsForCartActionsType): addItemsToCartResponse => {
  switch(action.type) {
    case Add_PRODUCTS_FROM_CART_REQUEST:
      return {
        ...state,
        loading: true
      }
    case Add_PRODUCTS_FROM_CART_SUCCESS:
      return {
        ...state,
        data: action.payload
      }
    case Add_PRODUCTS_FROM_CART_FAILURE:
      return {
        ...state,
        error: action.payload
      }
  }
}

export default addItemsToCartReducer;