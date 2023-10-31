export enum CommandStatus {
  RECEIVED = 'RECEIVED',
  FAILED = 'FAILED'
}

export interface UpdateCommandStatus {
  update: (status: CommandStatus) => Promise<void>;
}
