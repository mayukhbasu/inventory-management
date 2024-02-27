

import * as amqp from 'amqplib';
import { createClient } from 'redis';
import dotenv from "dotenv";
import { promisify } from 'util'

import logger from "../logger";
import { pool, query } from "../config/db";

dotenv.config();

const redisClient = createClient();

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

type stockType = 'order' | 'receipt';

type productStock = {
  productID: string,
  currentStock: number
}

type Product = {
  productid: number,
  name: string,
  description: string,
  lowstockthreshold: number,
  price: number
}

type CachedProduct = {
  currentUser: string,
  selectedProducts: {
    [productID: string]: number
  }
}

export class StockService{
  
  static async updateStock(productID: string, quantity: number, type: stockType): Promise<string> {
    logger.info('Inside update stock function of updateStock');
    
    // Obtain a client from the pool
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN'); // Start a transaction

        let sql = '';
        if (type === 'order') {
            sql = 'UPDATE StockLevels SET Quantity = Quantity - $2 WHERE ProductID = $1';
            
        } else if (type === 'receipt') {
            sql = 'UPDATE StockLevels SET Quantity = Quantity + $2 WHERE ProductID = $1';
            
        }
        logger.info(sql);

        await client.query(sql, [productID, quantity]);

        const checkSQL = 'SELECT quantity FROM StockLevels WHERE ProductID = $1';
        const checkRes = await client.query(checkSQL, [productID]);
        logger.info(checkRes);
        if (checkRes.rows.length > 0 && checkRes.rows[0].quantity < 0) {
            // Rollback if quantity goes below zero
            await client.query('ROLLBACK');
            throw new Error(`Quantity update results in invalid stock level for product ${productID}. Reverting changes.`);
        }

        await client.query('COMMIT'); // Commit the transaction
        logger.info(`Stock updated for product ${productID}, quantity ${quantity}, type ${type}`);
        return `Stock updated for product ${productID}, quantity ${quantity}, type ${type}`;
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback on error
        logger.error(`An error occurred: ${err}`);
        throw new Error(`An error occurred: ${err}`);
    } finally {
        client.release(); // Release the client back to the pool
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
      
      if(alertStocks.length > 0) {
        const connection = await amqp.connect(process.env.AMQP_URL as string || 'amqp://localhost');
        
        const channel = await connection.createChannel();

        const topicExchange = process.env.TOPIC_EXCHANGE as string;
        const routingKey = 'stock.alert.new';
        const dlx = process.env.DEAD_LETTER_EXCHANGE as string;
        const dlQueue = process.env.DEAD_LETTER_QUEUE as string;
        const dlRoutingKey = 'error';

        await channel.assertExchange(dlx, 'direct', {durable: true});
        await channel.assertQueue(dlQueue, {durable: true});
        await channel.bindQueue(dlQueue, dlx, dlRoutingKey);
        await channel.assertExchange(topicExchange, 'topic', {durable: true});
        await channel.assertQueue(process.env.MAIN_STOCK_ALERT_QUEUE as string, {
          durable: true,
          arguments: {
            'x-dead-letter-exchange': dlx, // Specify the DLX
            'x-dead-letter-routing-key': dlRoutingKey // DL routing key 
          }
        });
        await channel.bindQueue(process.env.MAIN_STOCK_ALERT_QUEUE as string, topicExchange, routingKey);
        const message = JSON.stringify(alertStocks);
        logger.info(`Publishing message to ${topicExchange} with routing key ${routingKey}: ${message}`);
        channel.publish(topicExchange, routingKey, Buffer.from(message));
        await channel.close();
        await connection.close();
      }

      return alertStocks;
    } catch(err) {
      logger.error(err)
      throw new Error(`An error occurred: ${err}`);
    }
  }

  static async getAllProductsFromInventory(page: number, pageSize: number): Promise<Product[]> {
    logger.info('Inside get all products function inside stock service');
    try {
      const offset = (page - 1) * pageSize;
      const getAllproductsSQL = 'SELECT * from products order by productId limit $1 offset $2';
      const result = await query(getAllproductsSQL, [pageSize, offset]);
      logger.info(result.rows);
      return result.rows;
    } catch(err) {
      throw err;
    }
    
  }
  static async addItemsTocart(cachedProduct: CachedProduct): Promise<boolean> {
    logger.info('cached product is ', cachedProduct);
    const redisClient = createClient({
      // Specify Redis connection options here if needed
    });

    // Listen for error events on the Redis client
    redisClient.on('error', (err) => logger.error('Redis Client Error', err));

    try {
      // Connect to Redis
      await redisClient.connect();

      const userId = cachedProduct.currentUser;
      const serializedData = JSON.stringify(cachedProduct);
      logger.info(serializedData);

      // Store serialized data in Redis with the user ID included in the key
      await redisClient.set(`cachedProducts:${userId}`, serializedData);

      logger.info(`Items added to cart for user ${userId}`);
      return true;
    } catch (error) {
      logger.error(`Error adding items to cart: ${error}`);
      throw new Error(`Error adding items to cart: ${error}`);
    } finally {
      // Ensure Redis client is properly closed
      await redisClient.disconnect();
    }
  }
  
}