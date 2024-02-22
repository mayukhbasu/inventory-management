import { Product } from "../../models/Product";

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export interface FetchProductsSuccess {
  status: string;
  message: Product[];
}

export interface FetchProductsFailure {
  status: string;
  message: any;
}

interface FetchProductsActionRequest {
  type: typeof FETCH_PRODUCTS_REQUEST;
}

interface FetchProductsActionSuccess {
  type: typeof FETCH_PRODUCTS_SUCCESS;
  payload: FetchProductsSuccess
}

interface FetchProductsActionFailure {
  type: typeof FETCH_PRODUCTS_FAILURE;
  payload: FetchProductsFailure
}

export type  FetchProductsType = FetchProductsActionRequest | FetchProductsActionSuccess | FetchProductsActionFailure;
