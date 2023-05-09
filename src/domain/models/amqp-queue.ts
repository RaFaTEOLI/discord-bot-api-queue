import { type SaveMusic, type SaveQueue } from '../usecases';

export type AmqpQueue = {
  action: 'music' | 'queue';
  factory: SaveQueue | SaveMusic;
};
