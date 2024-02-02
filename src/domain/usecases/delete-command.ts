export type DeleteCommandParams = {
  discordId: string;
};

export interface DeleteCommand {
  save: (params: DeleteCommandParams) => Promise<void>;
}
