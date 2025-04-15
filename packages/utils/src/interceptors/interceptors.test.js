import { renderHook } from '@testing-library/react';
import {
  authInterceptor,
  authInterceptorWithChrome,
  errorInterceptor,
  interceptor401,
  responseDataInterceptor,
  useAxiosWithPlatformInterceptors,
} from './interceptors';

global.insights = {
  chrome: {
    auth: {
      getUser: jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 1);
          }),
      ),
      logout: jest.fn(),
    },
  },
};

it('authInterceptor', async () => {
  const config = await authInterceptor({});
  expect(config).toMatchObject({});
});

describe('authInterceptorWithChrome', () => {
  it('does not call chrome via the global scope when chrome is provided', async () => {
    const fakeChrome = {
      auth: {
        getUser: jest.fn(),
      },
    };
    const interceptor = authInterceptorWithChrome();

    interceptor().then(() => {
      expect(fakeChrome.auth.getUser).toHaveBeenCalled();
      expect(insights.chrome.auth.getUser).not.toHaveBeenCalled();
    });
  });
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

describe('interceptor401WithChrome', () => {
  it('does not call chrome via the global scope when chrome is provided', async () => {
    const fakeChrome = {
      auth: {
        logout: jest.fn(),
      },
    };
    const interceptor = authInterceptorWithChrome();

    interceptor().then(() => {
      expect(fakeChrome.auth.logout).toHaveBeenCalled();
      expect(insights.chrome.auth.logout).not.toHaveBeenCalled();
    });
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

describe('useAxiosWithPlatformInterceptors', () => {
  it.skip('should throw response error', () => {
    /**
     * The useAxiosWithPlatformInterceptors has a circular dependency with the useChrome hook.
     * The frontend components package depends on the utils package and utils package would depends on the frontend components package.
     * Disabling this test for now.
     */
    const { result } = renderHook(() => useAxiosWithPlatformInterceptors());

    expect(result.current).toHaveProperty('interceptors');
    expect(result.current).toHaveProperty('create');
  });
});
