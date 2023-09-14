import { faker } from '@faker-js/faker';
import { type CommandOptionType, type SaveCommandParams } from '@/domain/usecases';

const makeCommandOptionType = (): CommandOptionType =>
  faker.helpers.arrayElement(Array.from({ length: 11 }, (_, i) => i + 1)) as CommandOptionType;

export const mockSaveCommandParams = (): SaveCommandParams => {
  return {
    name: faker.word.noun(),
    type: makeCommandOptionType(),
    description: faker.lorem.words(),
    options: [
      {
        name: faker.word.noun(),
        description: faker.lorem.words(),
        type: makeCommandOptionType(),
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
        type: makeCommandOptionType(),
        required: faker.datatype.boolean()
      }
    ]
  };
};
