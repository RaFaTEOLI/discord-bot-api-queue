/* eslint-disable @typescript-eslint/no-explicit-any */
import { faker } from '@faker-js/faker';
import { type HttpRequest, type HttpResponse, HttpStatusCode, type HttpClient } from '@/data/protocols/http';

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.helpers.arrayElement(['get', 'post', 'put', 'delete', 'patch']),
  body: faker.datatype.json(),
  headers: faker.datatype.json(),
  params: faker.datatype.json()
});

export class HttpClientSpy<R = any> implements HttpClient<R> {
  url?: string;
  method?: string;
  body?: any;
  headers?: any;
  params?: any;
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.success
  };

  async request(data: HttpRequest): Promise<HttpResponse<R>> {
    this.url = data.url;
    this.method = data.method;
    this.body = data.body;
    this.headers = data.headers;
    this.params = data.params;
    return await Promise.resolve(this.response);
  }
}
