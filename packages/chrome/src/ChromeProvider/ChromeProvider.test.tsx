import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import ChromeProvider from './ChromeProvider';
import * as fetch from '../utils/fetch';
import { History } from 'history';

const flushPromises = () => new Promise(setImmediate);

describe('ChromeProvider', () => {
  const getSpy = jest.spyOn(fetch, 'get');
  const postSpy = jest.spyOn(fetch, 'post');
  beforeEach(() => {
    getSpy.mockReset();
    postSpy.mockReset();
  });

  test('should mount and trigger init API call', async () => {
    getSpy.mockResolvedValueOnce([]);
    postSpy.mockResolvedValueOnce([]);
    await act(async () => {
      await render(
        <MemoryRouter>
          <ChromeProvider />
        </MemoryRouter>
      );
    });

    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith('/api/chrome-service/v1/user');
  });

  test('should post new data on pathname change', async () => {
    getSpy.mockResolvedValueOnce([]);
    postSpy.mockResolvedValue(['/', '/bar']);
    let testPush: History['push'];
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Route
            path="*"
            render={({ history }) => {
              testPush = history.push;
              return null;
            }}
          ></Route>
          <ChromeProvider bundle="bundle-title" />
        </MemoryRouter>
      );
    });
    // change location
    act(() => {
      testPush('/foo/bar');
    });

    // wait for calls to be finished
    await act(async () => {
      await flushPromises();
    });
    expect(postSpy).toHaveBeenCalledTimes(2);
    expect(postSpy).toHaveBeenLastCalledWith('/api/chrome-service/v1/last-visited', { pathname: '/foo/bar', title: '', bundle: 'bundle-title' });
  });

  test('should not update state on mount if received error response', async () => {
    const errorResponse = { errors: [{ status: 404, meta: { response_by: 'gateway' }, detail: 'Undefined Insights application' }] };
    getSpy.mockRejectedValue(errorResponse);
    postSpy.mockRejectedValue(errorResponse);
    // do not polute console with errors
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(() => undefined);
    await act(async () => {
      await render(
        <MemoryRouter>
          <ChromeProvider />
        </MemoryRouter>
      );
    });

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy.mock.calls).toEqual([
      ['Unable to update last visited pages!', errorResponse],
      ['Unable to initialize ChromeProvider!', errorResponse],
    ]);
    consoleSpy.mockRestore();
  });
});
