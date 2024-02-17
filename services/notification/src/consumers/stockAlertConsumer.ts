// src/consumers/stockAlertConsumer.ts
import * as amqp from 'amqplib';

export async function startConsumer() {
  const connection = await amqp.connect(process.env.AMQP_URL || 'amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'stock_alerts';
  await channel.assertQueue(queue, {durable: false});
  channel.consume(queue, async(msg) => {
    if(msg) {
      console.log(msg.content.toString());
      channel.ack(msg);
    }
  })
}
