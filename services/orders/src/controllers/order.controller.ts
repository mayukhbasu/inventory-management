import { Request, Response } from "express";
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
      res.json({ status: "success", message: result });
    } catch(error) {
      logger.error(error);
      res.status(500).json({ status: "error", message: error });
    }
  }
}