import { type HttpClient } from '@/data/protocols/http';
import { DiscordAuthorizeHttpClientDecorator } from '@/main/decorators';
import { makeAxiosHttpClient } from '@/main/factories/http/axios-http-client-factory';

export const makeDiscordAuthorizeHttpClientDecorator = (): HttpClient => {
  return new DiscordAuthorizeHttpClientDecorator(makeAxiosHttpClient());
};
