import { type HttpClient } from '@/data/protocols/http';
import { type DeleteCommand } from '@/domain/usecases';

export class RemoteDeleteCommand implements DeleteCommand {
  constructor(private readonly url: string, private readonly httpClient: HttpClient<void>) {}

  async delete(id: string): Promise<void> {
    await this.httpClient.request({
      url: `${this.url}/${id}`,
      method: 'delete'
    });
  }
}
