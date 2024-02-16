import { query } from "../config/db";
import logger from "../logger";

type stockType = 'order' | 'receipt';

type productStock = {
  productID: string,
  currentStock: number
}

export class StockModel {
  
  static async updateStock(productID: string, quantity: number, type: stockType): Promise<string> {
    logger.info('Inside update stock function of updateStock');
    let sql = '';
    if (type === 'order') {
        sql = 'UPDATE StockLevels SET Quantity = Quantity - $2 WHERE ProductID = $1';
        logger.debug(sql)
    } else if (type === 'receipt') {
        sql = 'UPDATE StockLevels SET Quantity = Quantity + $2 WHERE ProductID = $1';
        logger.debug(sql);
    }

    try {
        const res = await query(sql, [productID, quantity]);
        logger.error(res)
        if (res.rowCount === 0) {
            throw new Error('Product not found or quantity update failed.');
        }
        return `Stock updated for product ${productID}, quantity ${quantity}, type ${type}`;
    } catch (err) {
        throw new Error(`An error occurred: ${err}`);
    }
}

  static async getStockLevel(productID: string): Promise<productStock> {
    logger.info('Inside getStockLevel function of StockModel');
    try {
      const result = await query('select quantity from stocklevels where productID = $1', [productID]);
      const currentStock = result.rows[0].quantity;
      logger.info(currentStock);
      return {productID, currentStock}
    } catch(err) {
      logger.error(err)
      throw new Error(`An error occurred: ${err}`);
    }
  }
  
}