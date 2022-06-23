import { authInterceptor, errorInterceptor, interceptor401, responseDataInterceptor } from './interceptors';

global.insights = {
  chrome: {
    auth: {
      getUser: () =>
        new Promise((resolve) => {
          setTimeout(resolve, 1);
        }),
      logout: jest.fn(),
    },
  },
};

it('authInterceptor', async () => {
  const config = await authInterceptor({});
  expect(config).toMatchObject({});
});

describe('responseDataInterceptor', () => {
  it('data object', () => {
    expect(responseDataInterceptor({ data: 'data' })).toBe('data');
  });

  it('plain response', () => {
    expect(responseDataInterceptor('data')).toBe('data');
  });
});

describe('interceptor401', () => {
  it('generic error', () => {
    expect(() => interceptor401('')).toThrow();
  });

  it('should call logout', () => {
    interceptor401({ response: { status: 401 } });
    expect(insights.chrome.auth.logout).toHaveBeenCalled();
  });
});

describe('errorInterceptor', () => {
  it('should throw data error', () => {
    expect(() => errorInterceptor({ response: { data: 'error' } })).toThrow();
  });

  it('should throw response error', () => {
    expect(() => errorInterceptor('')).toThrow();
  });
});
