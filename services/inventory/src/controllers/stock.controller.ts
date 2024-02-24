import { Request, Response } from "express";
import { StockService } from "../services/stock.service";
import logger from "../logger";

export class StockController {
    static async updateStock(req: Request, res: Response): Promise<void> {
        logger.info("Started executing update stock function inside StockController");
        try {
            const { productID, quantity, type } = req.body;
            logger.debug(`product ID is ${productID} quantity is ${quantity} type is ${type}`);
            const result = await StockService.updateStock(productID, quantity, type);
            logger.info(result);
            res.json({ status: "success", message: result });
        } catch (error) {
          logger.error(error);
          res.status(500).json({ status: "error", message: error });
        }
    }

    static async getStockLevels(req: Request, res: Response): Promise<void> {
      logger.info('Started executing getStockLevels function inside StockController');
      try {
        const { productID } = req.query;
        if (!productID) {
          logger.error('ProductID is required');
          res.status(400).json({ status: "error", message: 'ProductID is required' });
          return;
        }
        logger.info(`Product ID is ${productID}`);
        const result = await StockService.getStockLevel(productID as string);
        res.json({ status: "success", message: result }); // Assuming result contains the relevant stock level information
      } catch (error) {
        logger.error('Error in getStockLevels:', error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }
    
    static async getAlertStockLevels(req: Request, res: Response): Promise<void> {
      logger.info('Started executing getAlertStockLevels function inside StockController');
      try {
        const result = await StockService.getAlertNewStock();
        logger.info(`Result is ${result}`);
        res.json({ status: "success", message: result }); 
      } catch(err) {
        logger.error('Error in getAlertStockLevels:', err);
        res.status(500).json({ status: "error", message: 'Internal server error' });
      }
    }

    static async getAllProducts(req: Request, res: Response): Promise<void> {
      logger.info('Started executing getAllProducts function inside StockController');
      try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 12;
        const result = await StockService.getAllProductsFromInventory(page, pageSize);
        logger.info(`Result is ${result}`)
        res.json({ status: "success", message: result }); 
      } catch(err) {
        logger.error('Error in getAlertStockLevels:', err);
        res.status(500).json({ status: "error", message: err});
      }
    }

    static async addItemsTocart(req: Request, res: Response): Promise<void> {
      
    }
}