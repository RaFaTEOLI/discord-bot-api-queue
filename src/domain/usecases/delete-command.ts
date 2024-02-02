export interface DeleteCommand {
  save: (id: string) => Promise<void>;
}
