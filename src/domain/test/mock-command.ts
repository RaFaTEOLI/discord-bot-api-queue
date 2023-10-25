import { faker } from '@faker-js/faker';
import { ApplicationCommandType, CommandOptionType, type SaveCommandParams } from '@/domain/usecases';

export const mockApplicationCommandType = (): ApplicationCommandType =>
  faker.helpers.arrayElement([
    ApplicationCommandType.CHAT_INPUT,
    ApplicationCommandType.MESSAGE,
    ApplicationCommandType.USER
  ]);

const mockCommandOptionType = (): CommandOptionType =>
  faker.helpers.arrayElement([
    CommandOptionType.SUB_COMMAND,
    CommandOptionType.SUB_COMMAND_GROUP,
    CommandOptionType.STRING,
    CommandOptionType.INTEGER,
    CommandOptionType.BOOLEAN,
    CommandOptionType.USER,
    CommandOptionType.CHANNEL,
    CommandOptionType.ROLE,
    CommandOptionType.MENTIONABLE,
    CommandOptionType.NUMBER,
    CommandOptionType.ATTACHMENT
  ]);

export const mockSaveCommandParams = (): SaveCommandParams => {
  return {
    name: faker.word.noun(),
    type: mockApplicationCommandType(),
    description: faker.lorem.words(),
    options: [
      {
        name: faker.word.noun(),
        description: faker.lorem.words(),
        type: mockCommandOptionType(),
        required: faker.datatype.boolean(),
        choices: [
          {
            name: faker.word.noun(),
            value: faker.word.verb()
          },
          {
            name: faker.word.noun(),
            value: faker.word.verb()
          },
          {
            name: faker.word.noun(),
            value: faker.word.verb()
          }
        ]
      },
      {
        name: faker.word.noun(),
        description: faker.lorem.words(),
        type: mockCommandOptionType(),
        required: faker.datatype.boolean()
      }
    ]
  };
};
