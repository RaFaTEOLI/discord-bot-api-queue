import {
  type UpdateCommandStatus,
  type SaveCommand,
  type SaveMusic,
  type SaveQueue,
  type UpdateCommandParams
} from '@/domain/usecases';

export type AmqpQueue = {
  action: 'music' | 'queue' | 'command';
  factory: SaveQueue | SaveMusic | SaveCommand;
  ack?: {
    function: UpdateCommandStatus;
    functionName: 'update';
    successPayload: (discordId: string) => UpdateCommandParams;
    failPayload: UpdateCommandParams;
  };
};
