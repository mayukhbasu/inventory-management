// src/consumers/stockAlertConsumer.ts
import * as amqp from 'amqplib';
import logger from '../logger';
import { pool } from '../utils/amqpHelper';

import dotenv from "dotenv";
import { processMessageAndSendEmail } from '../utils/sendEmail';

dotenv.config();

type Product = {
  name: string,
  quantity: number
}

export async function startConsumer() {
  logger.info("Started executing inside startConsumer");
  const connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
  const channel = connection.createChannel();
  const topicExchange = process.env.TOPIC_EXCHANGE as string;
  const routingKey = 'stock.alert.#';
  (await channel).assertExchange(topicExchange, 'topic', {durable: true});
  const queue = process.env.MAIN_STOCK_ALERT_QUEUE as string;
  logger.info(queue);
  (await channel).assertQueue(queue, 
    {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'stock_alerts_dlx', // Specify the DLX
        'x-dead-letter-routing-key': 'error' // DL routing key 
      }
    });
  (await channel).bindQueue(queue, topicExchange, routingKey);
  (await channel).consume(queue, async (msg) => {
    if(msg) {
      logger.info(`Message recieved inside consumer ${msg}}`)
      const contentAsString = msg.content.toString();
      const contentAsJSON = JSON.parse(contentAsString);
      logger.info("Received:", contentAsJSON.message);
      await insertProductsInChunks(contentAsJSON);
      await processMessageAndSendEmail(msg, channel);
      logger.info(`Processed message: ${JSON.stringify(contentAsJSON)}`);
      (await channel).ack(msg);
    }
  }, {noAck: false})
}

async function insertProductsInChunks(products: Product[], chunkSize = 500) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize);
      // Generate the values string for the SQL statement
      const values = chunk.map((_, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`).join(',');
      // Flatten the product objects for the parameterized query
      const valueArgs = chunk.flatMap(p => [p.name, p.quantity]);
      const queryText = `INSERT INTO alert_stocks (name, quantity) VALUES ${values}`;
      await client.query(queryText, valueArgs);
    }
    await client.query('COMMIT');
  } catch(err) {
      console.error('Error during the batch insert operation:', err);
      await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}
