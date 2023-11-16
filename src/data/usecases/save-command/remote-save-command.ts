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

    let url: string = this.url;
    let method: HttpMethod = 'post';

    if (getCommandsHttpResponse.statusCode === HttpStatusCode.success) {
      const command = getCommandsHttpResponse.body?.find(command => command.name === data.name);
      if (command?.id) {
        url = `${this.url}/${command.id}`;
        method = 'patch';
      }
    }

    const httpResponse = await this.saveHttpGetClient.request({
      url,
      method,
      body: data
    });

    console.log(httpResponse);

    switch (httpResponse.statusCode) {
      case HttpStatusCode.success:
        return;
      case HttpStatusCode.created:
        return;
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}
