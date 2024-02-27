// fetchAllProductsTypes.ts


export const Add_PRODUCTS_FROM_CART_REQUEST = 'Add_PRODUCTS_FROM_CART_REQUEST';
export const Add_PRODUCTS_FROM_CART_SUCCESS = 'Add_PRODUCTS_FROM_CART_SUCCESS';
export const Add_PRODUCTS_FROM_CART_FAILURE = 'Add_PRODUCTS_FROM_CART_FAILURE';

export interface AddProductsForCartSuccessPayload {
  status: string;
  message: boolean;
}

export interface AddProductsForCartFailurePayload {
  status: string;
  message: any; // Assuming error message is a string for simplification
}

 interface AddProductsForCartRequestAction {
  type: typeof Add_PRODUCTS_FROM_CART_REQUEST;
}

 interface AddProductsForCartSuccessAction {
  type: typeof Add_PRODUCTS_FROM_CART_SUCCESS;
  payload: AddProductsForCartSuccessPayload;
}

 interface AddProductsForCartFailureAction {
  type: typeof Add_PRODUCTS_FROM_CART_FAILURE;
  payload: AddProductsForCartFailurePayload;
}

export type AddProductsForCartActionsType = AddProductsForCartRequestAction | AddProductsForCartSuccessAction | AddProductsForCartFailureAction;
