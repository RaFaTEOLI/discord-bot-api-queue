import { type HttpClient, HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { type MusicModel } from '@/domain/models/music';
import { type SaveCommand, type SaveCommandParams } from '@/domain/usecases';

export class RemoteSaveCommand implements SaveCommand {
  constructor(private readonly url: string, private readonly httpGetClient: HttpClient<MusicModel>) {}

  async save(data: SaveCommandParams): Promise<void> {
    const httpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'post',
      body: data
    });
    switch (httpResponse.statusCode) {
      case HttpStatusCode.noContent:
        return;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}
