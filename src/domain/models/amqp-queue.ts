import {
  type UpdateCommand,
  type SaveCommand,
  type SaveMusic,
  type SaveQueue,
  type UpdateCommandParams
} from '@/domain/usecases';

export type AmqpQueue = {
  action: 'music' | 'queue' | 'command';
  factory: SaveQueue | SaveMusic | SaveCommand;
  response?: boolean;
  ack?: {
    function: UpdateCommand;
    functionName: 'update';
    successPayload: (discordId: string) => UpdateCommandParams;
    failPayload: UpdateCommandParams;
  };
};
