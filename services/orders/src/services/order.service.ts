import { pool } from "../config/db";
import logger from "../logger";

type Item = {
  productId: number,
  quantity: number,
  priceAtPurchase: number
}

export class OrderService {
  static async orders(customerId: string, items: Item[]) {
    try {
      const orderQuery = `INSERT INTO orders (customerId, orderDate, status)
      VALUES ($1, NOW(), 'pending')
      RETURNING orderId;`;
      const orderResult = await pool.query(orderQuery, [customerId]);
      const orderId = orderResult.rows[0].orderid;
      logger.info(orderId);
  
      // Fetch prices for each item and update the item object
      for (const item of items) {
        const price = await this.fetchProductPrice(item.productId);
        if (price !== null) {
          item.priceAtPurchase = price;
        } else {
          // Handle the case where the product price is not found
          throw new Error(`Price for product ${item.productId} not found`);
        }
      }
  
      const orderItemsQuery = `
      INSERT INTO OrderItems (orderId, productId, quantity, priceAtPurchase)
      VALUES ${items.map((item, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}`;
      const orderItemsValues = items.flatMap(item => [orderId, item.productId, item.quantity, item.priceAtPurchase]);
  
      await pool.query(orderItemsQuery, orderItemsValues);
      return {
        orderId,
        orderDate: new Date().toISOString(),
        status: 'Pending',
        items: items.map(item => ({
          ...item,
          productName: `Product ${item.productId}`,
        })),
      }
    } catch(err) {
      throw err;
    }
  }
  

  static async fetchProductPrice(productID: number) : Promise<number | null> {
    try {
      const query = 'select * from products where productID = $1';
      const result = await pool.query(query, [productID]);
      if(result.rows.length > 0) return parseFloat(result.rows[0].price);
      return null;
    } catch(error) {
      console.error('Error fetching product price:', error);
      throw error;
    }
    
  }
}