import { type HttpClient, HttpStatusCode, type HttpMethod } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { type SaveCommand, type SaveCommandParams } from '@/domain/usecases';
import { type DiscordCommandModel } from '@/domain/models';

export class RemoteSaveCommand implements SaveCommand {
  constructor(
    private readonly url: string,
    private readonly httpGetClient: HttpClient<DiscordCommandModel[]>,
    private readonly saveHttpGetClient: HttpClient<any>
  ) {}

  async save(data: SaveCommandParams): Promise<void> {
    const getCommandsHttpResponse = await this.httpGetClient.request({
      url: this.url,
      method: 'get'
    });

    let method: HttpMethod = 'post';

    if (getCommandsHttpResponse.statusCode === HttpStatusCode.success) {
      const command = getCommandsHttpResponse.body?.find(command => command.name === data.name);
      if (command) {
        method = 'patch';
      }
    }

    const httpResponse = await this.saveHttpGetClient.request({
      url: this.url,
      method,
      body: data
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.created:
        return;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}
