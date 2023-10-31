import { type HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { type MusicModel } from '@/domain/models/music';
import { type CommandStatus, type UpdateCommandStatus } from '@/domain/usecases';

export class RemoteUpdateCommandStatus implements UpdateCommandStatus {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<MusicModel>) {}

  async update(status: CommandStatus): Promise<void> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'patch',
      body: { discordStatus: status }
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}
