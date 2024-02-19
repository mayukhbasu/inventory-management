import { pool } from "../config/db";

type Item = {
  productId: number,
  quantity: number
}

export class OrderService {
  static async orders(customerId: string, items: Item[]) {
    try {
      const orderQuery = `INSERT INTO orders (customerId, orderDate, status)
      VALUES ($1, NOW(), 'pending')
      RETURNING orderId;`;
      const orderResult = await pool.query(orderQuery, [customerId]);
      const orderId = orderResult.rows[0].orderId;
      const orderItemsQuery = `
      INSERT INTO OrderItems (orderId, productId, quantity, priceAtPurchase)
      VALUES ${items.map((item: any, index: number) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}`;
      const orderItemsValues = items.flatMap((item: any) => [orderId, item.productId, item.quantity, item.priceAtPurchase]);
      await pool.query(orderItemsQuery, orderItemsValues);
      return {
        orderId,
        orderDate: new Date().toISOString(),
        status: 'Pending',
        items: items.map((item: any) => ({
          ...item,
          productName: `Product ${item.productId}`,
        })),
      }
  } catch(err) {
      throw err;
    }
  }
}