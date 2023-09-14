// enum CommandOptionType {
//   SUB_COMMAND = 1,
//   SUB_COMMAND_GROUP = 2,
//   STRING = 3,
//   INTEGER = 4, // Any integer between -2^53 and 2^53
//   BOOLEAN = 5,
//   USER = 6,
//   CHANNEL = 7, // Includes all channel types + categories
//   ROLE = 8,
//   MENTIONABLE = 9, // Includes users and roles
//   NUMBER = 10, // Any double between -2^53 and 2^53
//   ATTACHMENT = 11 // Attachment object
// }

export type CommandOptionType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type SaveCommandParams = {
  name: string;
  type: CommandOptionType;
  description: string;
  options?: Array<{
    name: string;
    description: string;
    type: CommandOptionType;
    required: boolean;
    choices?: Array<{
      name: string;
      value: string;
    }>;
  }>;
};

export interface SaveCommand {
  save: (data: SaveCommandParams) => Promise<void>;
}
