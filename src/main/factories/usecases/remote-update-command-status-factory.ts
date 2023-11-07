import { makeApiUrl } from '@/main/factories/http';
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators';
import { type UpdateCommandStatus } from '@/domain/usecases';
import { RemoteUpdateCommandStatus } from '@/data/usecases/update-command-status/remote-update-command-status';

export const makeRemoteUpdateCommandStatusFactory = (): UpdateCommandStatus => {
  return new RemoteUpdateCommandStatus(makeApiUrl('/commands'), makeAuthorizeHttpClientDecorator());
};
