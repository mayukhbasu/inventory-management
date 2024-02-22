import { Product } from "./Product";

export interface FetchProductsResponse {
  loading: boolean;
  data: Product[];
  error: any;
}