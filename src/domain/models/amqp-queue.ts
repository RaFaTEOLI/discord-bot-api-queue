import {
  type UpdateCommand,
  type SaveCommand,
  type SaveMusic,
  type SaveQueue,
  type UpdateCommandParams
} from '@/domain/usecases';

export enum Action {
  MUSIC = 'music',
  QUEUE = 'queue',
  COMMAND = 'command',
  DELETE_COMMAND = 'delete-command'
}

export type AmqpQueue = {
  action: Action;
  factory: SaveQueue | SaveMusic | SaveCommand;
  response?: boolean;
  ack?: {
    function: UpdateCommand;
    functionName: 'update';
    successPayload: (discordId: string) => UpdateCommandParams;
    failPayload: UpdateCommandParams;
  };
};
