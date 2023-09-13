import { HttpClientSpy } from '@/data/test';
import { RemoteSaveCommand } from './remote-save-command';
import { HttpStatusCode } from '@/data/protocols/http';
import { faker } from '@faker-js/faker';
import { mockSaveCommandParams } from '@/domain/test';

type SutTypes = {
  sut: RemoteSaveCommand;
  httpClientSpy: HttpClientSpy;
};

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
    const body = mockSaveCommandParams();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    };
    await sut.save(body);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe('post');
    expect(httpClientSpy.body).toEqual(body);
  });
});
