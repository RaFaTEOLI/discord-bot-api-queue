import { type SaveCommand, type SaveMusic, type SaveQueue } from '@/domain/usecases';

export type AmqpQueue = {
  action: 'music' | 'queue' | 'command';
  factory: SaveQueue | SaveMusic | SaveCommand;
};
