import amqp from 'amqplib';
import 'dotenv/config';

const queue = 'action';

(async () => {
  try {
    const connection = await amqp.connect(
      `amqp://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@localhost:${process.env.AMQP_PORT}`
    );
    const channel = await connection.createChannel();

    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(queue, { durable: false });
    await channel.consume(
      queue,
      message => {
        console.log(" [x] Received '%s'", message.content.toString());
      },
      { noAck: true }
    );

    console.log(' [*] Waiting for messages. To exit press CTRL+C');
  } catch (err) {
    console.warn(err);
  }
})();
