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
};

const mockBody = (): DiscordCommandModel[] => [mockDiscordCommandModel(), mockDiscordCommandModel()];

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteSaveCommand(url, httpClientSpy);

  return {
    sut,
    httpClientSpy
  };
};

describe('RemoteSaveCommand', () => {
  test('should call HttpClient with correct URL and Method', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.created
    };
    await sut.save(mockSaveCommandParams());
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
  });

  test('should call HttpClient with correct URL and Method when discordId is provided', async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const body = mockSaveCommandParams();
    body.discordId = faker.datatype.uuid();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: mockBody()
    };
    await sut.save(body);
    expect(httpClientSpy.url).toBe(`${url}/${body.discordId}`);
    expect(httpClientSpy.method).toBe('patch');
    expect(httpClientSpy.body).toEqual(body);
  });

  test('should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test('should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    };
    const promise = sut.save(mockSaveCommandParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('should return DiscordCommandModel if HttpClient returns 201', async () => {
    const { sut, httpClientSpy } = makeSut();
    const discordCommandModel = mockDiscordCommandModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.created,
      body: discordCommandModel
    };
    const response = await sut.save(mockSaveCommandParams());
    expect(response.id).toBe(discordCommandModel.id);
  });

  test('should return DiscordCommandModel if SaveHttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut();
    const discordCommandModel = mockDiscordCommandModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.success,
      body: discordCommandModel
    };
    const response = await sut.save(mockSaveCommandParams());
    expect(response.id).toBe(discordCommandModel.id);
  });
});
