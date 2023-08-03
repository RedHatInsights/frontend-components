import { get, post } from './fetch';

describe('fetch', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchSpy = jest.spyOn(global, 'fetch').mockImplementation((_input: RequestInfo | URL, _init?: RequestInit | undefined) => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { foo: 'bar' } }),
      clone: () => ({
        json: () => Promise.resolve({ data: { foo: 'bar' } }),
      }),
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
      credentials: 'include',
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
      credentials: 'include',
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
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  });

  test('should handle server errors', () => {
    const errorResponse = { errors: [{ status: 404, meta: { response_by: 'gateway' }, detail: 'Undefined Insights application' }] };
    fetchSpy.mockImplementationOnce(() =>
      // @ts-ignore
      Promise.resolve({
        ok: false,
        clone: () => ({
          headers: {
            get: () => 'application/json',
          },
          json: () => Promise.resolve(errorResponse),
        }),
      })
    );
    return get('/foo/bar').catch((error) => {
      expect(error).toEqual(errorResponse);
    });
  });
});
