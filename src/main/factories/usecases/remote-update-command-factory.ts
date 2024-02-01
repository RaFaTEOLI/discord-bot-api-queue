import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { type UpdateCommand } from '@/domain/usecases';
import { RemoteUpdateCommand } from '@/data/usecases/update-command-status/remote-update-command-status';

export const makeRemoteUpdateCommandFactory = (): UpdateCommand => {
  return new RemoteUpdateCommand(makeApiUrl('/commands'), makeAuthorizeHttpClientDecorator());
};
