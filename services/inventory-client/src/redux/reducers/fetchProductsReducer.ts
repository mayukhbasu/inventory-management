import { FetchProductsResponse } from "../../models/Product"
import { FETCH_PRODUCTS_FAILURE, FETCH_PRODUCTS_REQUEST, FETCH_PRODUCTS_SUCCESS, FetchProductsType } from "../types/fetchAllProductsTypes"

const initialState: FetchProductsResponse = {
  loading: false,
  data: [],
  error: null
}

const fetchProductsReducer = (state = initialState, action: FetchProductsType): FetchProductsResponse => {
  switch(action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true
      }
      case FETCH_PRODUCTS_SUCCESS:
        
        return {
          ...state,
          loading: false,
          data: action.payload.message
        }
        case FETCH_PRODUCTS_FAILURE:
          return {
            ...state,
            loading: false,
            error: action.payload.message
          }
        default :
          return state
  }
}

export default fetchProductsReducer;