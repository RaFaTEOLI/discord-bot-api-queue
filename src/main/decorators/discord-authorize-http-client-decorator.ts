import { type HttpClient, type HttpRequest, type HttpResponse } from '@/data/protocols/http';
import 'dotenv/config';

export class DiscordAuthorizeHttpClientDecorator implements HttpClient {
  constructor(private readonly httpClient: HttpClient) {}

  async request(data: HttpRequest): Promise<HttpResponse> {
    const accessToken = process.env.DISCORD_BOT_TOKEN;
    if (accessToken) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          Authorization: `Bot ${accessToken}`
        })
      });
    }
    const httpResponse = await this.httpClient.request(data);
    return httpResponse;
  }
}
