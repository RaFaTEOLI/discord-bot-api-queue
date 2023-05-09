import { faker } from '@faker-js/faker';
import { type SaveQueueParams } from '@/domain/usecases/save-queue';
import { type Queue } from '@/domain/models/queue';

export const mockQueueModel = (queueCount = 4): SaveQueueParams => {
  const queueSongs = Array.from(new Array(queueCount), () => ({
    name: faker.random.word(),
    author: faker.name.firstName(),
    duration: faker.random.numeric(5).toString(),
    url: faker.internet.url(),
    thumbnail: faker.internet.url()
  })) as Queue;

  return { songs: queueSongs };
};
