import { HttpClientSpy } from '@/data/test';
import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'vitest';
import { RemoteDeleteCommand } from './remote-delete-command';

type SutTypes = {
  sut: RemoteDeleteCommand;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteDeleteCommand(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteDeleteCommand', () => {
  test('should call HttpClient with correct URL and method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const discordId = faker.datatype.uuid();
    await sut.delete(discordId);
    expect(httpClientSpy.url).toBe(`${url}/${discordId}`);
    expect(httpClientSpy.method).toBe('delete');
  });
});
