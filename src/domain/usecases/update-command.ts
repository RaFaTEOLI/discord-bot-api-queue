export enum CommandStatus {
  RECEIVED = 'RECEIVED',
  FAILED = 'FAILED'
}

export type UpdateCommandParams = {
  discordId?: string;
  discordStatus: CommandStatus;
};

export interface UpdateCommand {
  update: (id: string, params: UpdateCommandParams) => Promise<void>;
}
