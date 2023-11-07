export enum CommandStatus {
  RECEIVED = 'RECEIVED',
  FAILED = 'FAILED'
}

export interface UpdateCommandStatus {
  update: (id: string, status: CommandStatus) => Promise<void>;
}
