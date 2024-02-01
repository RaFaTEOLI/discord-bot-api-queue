import { HttpClientSpy } from '@/data/test';
import { RemoteUpdateCommand } from './remote-update-command-status';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { mockSaveCommandParams } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { describe, test, expect } from 'vitest';
import { CommandStatus, type UpdateCommandParams } from '@/domain/usecases';

type SutTypes = {
  sut: RemoteUpdateCommand;
  httpClientSpy: HttpClientSpy;
};

const mockRequest = (): { id: string; params: UpdateCommandParams } => ({
  id: faker.datatype.uuid(),
  params: {
    discordId: faker.datatype.uuid(),
    discordStatus: faker.helpers.arrayElement([CommandStatus.RECEIVED, CommandStatus.FAILED])
  }
});

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteUpdateCommand(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteUpdateCommand', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const body = mockRequest();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    await sut.update(body.id, body.params);
    expect(httpClientSpy.url).toBe(`${url}/${body.id}`);
    expect(httpClientSpy.method).toBe('patch');
    expect(httpClientSpy.body).toEqual(body.params);
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const body = mockRequest();
    const promise = sut.update(body.id, body.params);
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const body = mockRequest();
    const promise = sut.update(body.id, body.params);
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const body = mockRequest();
    const promise = sut.update(body.id, body.params);
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return void if HttpClient returns 204', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSaveCommandParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
      body: httpResult
    };
    const body = mockRequest();
    const response = await sut.update(body.id, body.params);
    expect(response).toBeFalsy();
  });

  test('should call HttpClient with discordStatus only, when no discordId is provided', async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockSaveCommandParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
      body: httpResult
    };
    const body = mockRequest();
    delete body.params.discordId;
    const response = await sut.update(body.id, body.params);
    expect(response).toBeFalsy();
  });
});
