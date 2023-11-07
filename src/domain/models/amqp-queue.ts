import {
  type UpdateCommandStatus,
  type SaveCommand,
  type SaveMusic,
  type SaveQueue,
  type CommandStatus
} from '@/domain/usecases';

export type AmqpQueue = {
  action: 'music' | 'queue' | 'command';
  factory: SaveQueue | SaveMusic | SaveCommand;
  ack?: {
    function: UpdateCommandStatus;
    functionName: 'update';
    successPayload: CommandStatus;
    failPayload: CommandStatus;
  };
};
