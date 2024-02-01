import { RemoteSaveCommand } from '@/data/usecases';
import { makeDiscordApiUrl } from '@/main/factories/http';
import { makeDiscordAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { type SaveCommand } from '@/domain/usecases';

export const makeRemoteSaveCommandFactory = (): SaveCommand => {
  return new RemoteSaveCommand(makeDiscordApiUrl('/commands'), makeDiscordAuthorizeHttpClientDecorator());
};
