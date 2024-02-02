import { RemoteDeleteCommand } from '@/data/usecases/delete-command/remote-delete-command';
import { type DeleteCommand } from '@/domain/usecases';
import { makeDiscordApiUrl } from '@/main/factories/http';
import { makeDiscordAuthorizeHttpClientDecorator } from '@/main/factories/decorators';

export const makeRemoteDeleteCommandFactory = (): DeleteCommand => {
  return new RemoteDeleteCommand(makeDiscordApiUrl('/commands'), makeDiscordAuthorizeHttpClientDecorator());
};
