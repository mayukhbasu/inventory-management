export interface Product {
  productId: number;
  name: string;
  description: string;
  lowStockThreshold: number;
  price: string; // Assuming price is stored as a string for formatting purposes
}