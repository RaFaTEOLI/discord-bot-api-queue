import 'module-alias/register';
import { connect } from 'amqplib';
import 'dotenv/config';
import {
  makeRemoteSaveMusicFactory,
  makeRemoteSaveQueueFactory,
  makeRemoteSaveCommandFactory
} from '@/main/factories/usecases';
import { type AmqpQueue } from '@/domain/models';

const queues: AmqpQueue[] = [
  { action: 'music', factory: makeRemoteSaveMusicFactory() },
  { action: 'queue', factory: makeRemoteSaveQueueFactory() },
  { action: 'command', factory: makeRemoteSaveCommandFactory() }
];

void (async () => {
  try {
    const connection = await connect(
      `amqp://${process.env.AMQP_USERNAME}:${process.env.AMQP_PASSWORD}@${process.env.AMQP_ADRESS}:${process.env.AMQP_PORT}`
    );
    console.log('✅ Connected to AMQP');

    const channel = await connection.createChannel();

    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });

    for (const queue of queues) {
      await channel.assertQueue(queue.action, { durable: false });
      await channel.consume(
        queue.action,
        async message => {
          console.log(`📥 [${queue.action}] Received '%s'`, message.content.toString());
          try {
            const payload = JSON.parse(message.content.toString());
            await queue.factory.save(payload);
            channel.ack(message);
            console.log(`☑️ [${queue.action}] Acknowledged '%s'`, message.content.toString());
          } catch (err) {
            console.error('❌ Error while trying to call factory:', err.message);
          }
        },
        { noAck: false }
      );
    }

    console.log('⌛ Waiting for messages. To exit press CTRL+C');
  } catch (err) {
    console.warn(`❌ ${err}`);
  }
})();
