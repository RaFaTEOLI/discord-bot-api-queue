export interface DeleteCommand {
  delete: (id: string) => Promise<void>;
}
