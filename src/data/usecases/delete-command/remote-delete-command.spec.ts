import { HttpClientSpy } from '@/data/test';
import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'vitest';
import { RemoteDeleteCommand } from './remote-delete-command';
import { HttpStatusCode } from '@/data/protocols/http';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';

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

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.delete(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.delete(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.delete(faker.datatype.uuid());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });
});
