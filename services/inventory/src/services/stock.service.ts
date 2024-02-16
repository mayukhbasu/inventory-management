import { query } from "../config/db";
import logger from "../logger";

type stockType = 'order' | 'receipt';

type productStock = {
  productID: string,
  currentStock: number
}

export class StockService{
  
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
        logger.debug(res);
        const checkSQL = 'select quantity from stocklevels where productID = $1';
        const checkRes = await query(checkSQL, [productID]);
        if (checkRes.rows.length > 0 && checkRes.rows[0].quantity <= 0) {
          throw new Error(`Quantity update results in invalid stock level for product ${productID}.`);
        }
        logger.info(`Stock updated for product ${productID}, quantity ${quantity}, type ${type}`);
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

  static async getAlertNewStock(): Promise<productStock[]> {
    logger.info('Inside getStockLevel function of StockModel');
    try  {
      const result = await query('select p.name, s.quantity from products p join stocklevels s on p.productId = s.productId where s.quantity < p.lowstockthreshold');
      const alertStocks = result.rows;
      logger.info(alertStocks);
      return alertStocks;
    } catch(err) {
      logger.error(err)
      throw new Error(`An error occurred: ${err}`);
    }
  }
  
}