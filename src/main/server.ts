import 'module-alias/register';
import { connect } from 'amqplib';
import 'dotenv/config';
import {
  makeRemoteSaveMusicFactory,
  makeRemoteSaveQueueFactory,
  makeRemoteSaveCommandFactory,
  makeRemoteUpdateCommandStatusFactory
} from '@/main/factories/usecases';
import { type AmqpQueue } from '@/domain/models';
import { CommandStatus } from '@/domain/usecases';

const queues: AmqpQueue[] = [
  { action: 'music', factory: makeRemoteSaveMusicFactory() },
  { action: 'queue', factory: makeRemoteSaveQueueFactory() },
  {
    action: 'command',
    factory: makeRemoteSaveCommandFactory(),
    ack: {
      functionName: 'update',
      function: makeRemoteUpdateCommandStatusFactory(),
      successPayload: (discordId: string) => ({
        discordStatus: CommandStatus.RECEIVED,
        discordId
      }),
      failPayload: { discordStatus: CommandStatus.FAILED }
    }
  }
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
          let id = null;
          try {
            const payload = JSON.parse(message.content.toString());

            if (queue.ack) {
              id = payload.id;
              delete payload.id;
            }

            // TODO: use value from here to pass it into the successPayload function on line 68
            await queue.factory.save(payload);

            channel.ack(message);
            console.log(`☑️ [${queue.action}] Acknowledged '%s'`, message.content.toString());

            if (queue.ack) {
              try {
                await queue.ack.function[queue.ack.functionName](id, queue.ack.successPayload('any_value'));
                console.log(`☑️ [${queue.action}] Acknowledged Function '%s'`, queue.ack.functionName);
              } catch (err) {
                console.error('❌ Error while trying to call acknowledge function:', err.message);
              }
            }
          } catch (err) {
            console.error('❌ Error while trying to call factory:', err.message);

            if (queue.ack) {
              channel.ack(message);
              await queue.ack.function[queue.ack.functionName](id, queue.ack.failPayload);
            }
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
