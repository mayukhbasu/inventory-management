// src/consumers/stockAlertConsumer.ts
import * as amqp from 'amqplib';
import logger from '../logger';
import { pool } from '../utils/amqpHelper';

type Product = {
  name: string,
  quantity: number
}

export async function startConsumer() {
  const connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'stock_alerts';
  await channel.assertQueue(queue, {durable: false});
  channel.consume(queue, async(msg) => {
    if(msg) {
      const contentAsString = msg.content.toString();
      const contentAsJSON = JSON.parse(contentAsString);
      console.log(contentAsJSON);
      await insertProductsInChunks(contentAsJSON);
      logger.info(`Consumer Logs are ${JSON.stringify(contentAsJSON)}`);
      channel.ack(msg);
    }
  })
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
