import { get, post } from './fetch';

describe('fetch', () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((input: RequestInfo | URL, init?: RequestInit | undefined) => {
    return Promise.resolve({
      json: () => Promise.resolve({ data: { foo: 'bar' } }),
    } as Response);
  });

  beforeEach(() => {
    fetchSpy.mockClear();
  });

  test('should construct get fetch request', async () => {
    const response = await get('/foo/bar');
    expect(fetchSpy).toHaveBeenCalledWith('/foo/bar', { method: 'GET' });
    expect(response).toEqual({ foo: 'bar' });
  });

  test('should not override get method option', async () => {
    await get('/foo/bar', { method: 'PATCH' });
    expect(fetchSpy).toHaveBeenCalledWith('/foo/bar', { method: 'GET' });
  });

  test('should automatically assign correct header to POST request', async () => {
    await post('/foo/bar', { request: 'body' });
    expect(fetchSpy).toHaveBeenCalledWith('/foo/bar', {
      body: JSON.stringify({ request: 'body' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });

  test('should automatically add new header to POST request', async () => {
    await post('/foo/bar', { request: 'body' }, { headers: { 'x-rh-identity': 'foobar' } });
    expect(fetchSpy).toHaveBeenCalledWith('/foo/bar', {
      body: JSON.stringify({ request: 'body' }),
      headers: {
        'Content-Type': 'application/json',
        'x-rh-identity': 'foobar',
      },
      method: 'POST',
    });
  });

  test('should not override POST content type header', async () => {
    await post('/foo/bar', { request: 'body' }, { headers: { 'Content-Type': 'text' } });
    expect(fetchSpy).toHaveBeenCalledWith('/foo/bar', {
      body: JSON.stringify({ request: 'body' }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });
});
