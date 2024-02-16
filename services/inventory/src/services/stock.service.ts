import logger from "../logger";
import { StockModel } from "../models/stock.model";

export class StockService {
  static async updateStock(productID: string, quantity: number, type: 'order' | 'receipt'): Promise<string> {
    try {
      const result = await StockModel.updateStock(productID, quantity, type);
      return result;
    } catch (err) {
        throw err;
    }
  }

  static async getStockLevel(productID: string): Promise<{productID: string, currentStock: number}> {
    logger.info('Started executing getStockLevel function inside StockService');
    try {
      const result = await StockModel.getStockLevel(productID);
      logger.info(result);
      return result;
    } catch(err) {
      logger.error(err);
      throw err;
    }

  }
}