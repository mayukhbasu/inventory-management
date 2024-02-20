import { Request, Response } from "express";
import axios from 'axios';

import { OrderService } from "../services/order.service";
import logger from "../logger";


// request format = {
//   "customerId": "123",
//   "items": [
//     {"productId": "abc", "quantity": 2},
//     {"productId": "xyz", "quantity": 1}
//   ]
// }


export class OrderController {

  static async orders(req: Request, res: Response): Promise<void> {
    logger.info("Started executing orders process function inside OrderController");
    try {
      const {customerId, items} = req.body;
      const result = await OrderService.orders(customerId, items);
      logger.info(`Result is ${result}`);
      for(let item of result.items) {
        try {
          await this.updateInventory(item.productId, item.quantity);
        } catch(error) {
          res.status(500).json({ status: "error", message: error });
          return;
        }
      }
      res.json({ status: "success", message: result });
    } catch(error) {
      logger.error(error);
      res.status(500).json({ status: "error", message: error });
    }
  }

  static async updateInventory(productID: number, quantity: number, type = 'order'): Promise<void> {
    const inventoryUpdateURL =  process.env.ENVIRONMENT === 'KUBERNETES' ?
    'http://inventory-microservice:3000/inventory/update-stock': 
    'http://localhost:3000/inventory/update-stock';
    try {
      const response = await axios.post(inventoryUpdateURL, {
        productID: productID,
        quantity: quantity,
        type: type
      });
      logger.info(`Stock updated for productId ${productID}: ${response.data.message}`);
    } catch(error) {
      throw error;
    }
  }
}