import { HttpStatusCode, type HttpClient } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { type DeleteCommand } from '@/domain/usecases';

export class RemoteDeleteCommand implements DeleteCommand {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<void>) {}

  async save(id: string): Promise<void> {
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${id}`,
      method: 'delete'
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
