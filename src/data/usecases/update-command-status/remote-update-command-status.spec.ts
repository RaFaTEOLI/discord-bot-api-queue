import { HttpClientSpy } from '@/data/test';
import { RemoteUpdateCommandStatus } from './remote-update-command-status';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { mockSaveCommandParams } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { describe, test, expect } from 'vitest';
import { CommandStatus } from '@/domain/usecases';

type SutTypes = {
  sut: RemoteUpdateCommandStatus;
  httpClientSpy: HttpClientSpy;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteUpdateCommandStatus(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteUpdateCommandStatus', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const status = faker.helpers.arrayElement([CommandStatus.RECEIVED, CommandStatus.FAILED]);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success
    };
    await sut.update(status);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('patch');
    expect(httpClientSpy.body).toEqual({ discordStatus: status });
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.update(faker.helpers.arrayElement([CommandStatus.RECEIVED, CommandStatus.FAILED]));
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.update(faker.helpers.arrayElement([CommandStatus.RECEIVED, CommandStatus.FAILED]));
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.update(faker.helpers.arrayElement([CommandStatus.RECEIVED, CommandStatus.FAILED]));
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return void if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSaveCommandParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: httpResult
    };
    const response = await sut.update(faker.helpers.arrayElement([CommandStatus.RECEIVED, CommandStatus.FAILED]));
    expect(response).toBeFalsy();
  });
});
