import { HttpClientSpy } from '@/data/test';
import { RemoteSaveCommand } from './remote-save-command';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { mockDiscordCommandModel, mockSaveCommandParams } from '@/domain/test';
import { AccessDeniedError, UnexpectedError } from '@/domain/errors';
import { describe, test, expect } from 'vitest';
import { type DiscordCommandModel } from '@/domain/models';

type SutTypes = {
  sut: RemoteSaveCommand;
  httpClientSpy: HttpClientSpy;
  saveHttpGetClient: HttpClientSpy;
};

const mockBody = (): DiscordCommandModel[] => [mockDiscordCommandModel(), mockDiscordCommandModel()];

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const saveHttpGetClient = new HttpClientSpy();
  const sut = new RemoteSaveCommand(url, httpClientSpy, saveHttpGetClient);

  return {
    sut,
    httpClientSpy,
    saveHttpGetClient
  };
};

describe('RemoteSaveCommand', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.created
    };
    await sut.save(mockSaveCommandParams());
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('get');
  });

  test('should call SaveHttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut(url);
    const body = mockSaveCommandParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockBody()
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.created
    };
    await sut.save(body);
    expect(saveHttpGetClient.url).toBe(url);
    expect(saveHttpGetClient.method).toBe('post');
    expect(saveHttpGetClient.body).toEqual(body);
  });

  test('should throw AccessDeniedError if SaveHttpClient returns 403', async () => {
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockBody()
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if SaveHttpClient returns 404', async () => {
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockBody()
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if SaveHttpClient returns 500', async () => {
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockBody()
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return DiscordCommandModel if SaveHttpClient returns 201', async () => {
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut();
    const discordCommandModel = mockDiscordCommandModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: []
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.created,
      body: discordCommandModel
    };
    const response = await sut.save(mockSaveCommandParams());
    expect(response.id).toBe(discordCommandModel.id);
  });

  test('should call SaveHttpClient with Patch when a command is found', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut(url);
    const body = mockSaveCommandParams();
    const commandModel = mockDiscordCommandModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: [{ ...commandModel, name: body.name }]
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.created
    };
    await sut.save(body);
    expect(saveHttpGetClient.url).toBe(`${url}/${commandModel.id}`);
    expect(saveHttpGetClient.method).toBe('patch');
    expect(saveHttpGetClient.body).toEqual(body);
  });

  test('should call SaveHttpClient with correct URL and Method even if HttpClient fails', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut(url);
    const body = mockSaveCommandParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.created
    };
    await sut.save(body);
    expect(saveHttpGetClient.url).toBe(url);
    expect(saveHttpGetClient.method).toBe('post');
    expect(saveHttpGetClient.body).toEqual(body);
  });

  test('should return DiscordCommandModel if SaveHttpClient returns 200', async () => {
    const { sut, httpClientSpy, saveHttpGetClient } = makeSut();
    const discordCommandModel = mockDiscordCommandModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: []
    };
    saveHttpGetClient.response = {
      statusCode: HttpStatusCode.success,
      body: discordCommandModel
    };
    const response = await sut.save(mockSaveCommandParams());
    expect(response.id).toBe(discordCommandModel.id);
  });
});
