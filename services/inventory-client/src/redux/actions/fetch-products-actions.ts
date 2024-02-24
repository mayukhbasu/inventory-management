import { FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FetchProductsFailure, FetchProductsSuccess, FetchProductsType } from "../types/fetchAllProductsTypes"
import { Dispatch } from "redux";
import axios from 'axios';


const fetchProductsRequest = (): FetchProductsType => {
  return {
    type: FETCH_PRODUCTS_REQUEST
  }
}

const fetchProductsSuccess = (response: FetchProductsSuccess): FetchProductsType => {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: response
  }
}

const fetchProductsFailure = (response: FetchProductsFailure): FetchProductsType => {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    payload: response
  }
}

export const fetchProducts = (page: number) => {
  return async (dispatch: Dispatch<FetchProductsType>) => {
    dispatch(fetchProductsRequest());
   try {
    const response = await axios.get(`http://localhost:8080/inventory/products?page=${page}`, {withCredentials: true});
     dispatch(fetchProductsSuccess(response.data));
   } catch(error:any) {
     dispatch(fetchProductsFailure(error)); 
   }
  }
}