import React, { useEffect } from 'react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ScalprumContext } from '@scalprum/react-core';
import { PluginStore } from '@openshift/dynamic-plugin-sdk';

import ChromeProvider from './ChromeProvider';
import * as fetch from '../utils/fetch';

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

  test('should post new data on title change', async () => {
    jest.useFakeTimers();
    getSpy.mockResolvedValueOnce([]);
    postSpy.mockResolvedValue(['/', '/bar']);
    const DocumentMutator = () => {
      useEffect(() => {
        document.title = 'Foo title';
      }, []);
      return null;
    };
    // mock the initial document title
    document.title = 'Initial title';
    await act(async () => {
      render(
        <ScalprumContext.Provider
          value={{
            config: {},
            initialized: true,
            pluginStore: new PluginStore(),
            api: {
              chrome: {
                getBundleData: () => ({
                  bundleTitle: 'bundle-title',
                }),
              },
            },
          }}
        >
          <MemoryRouter initialEntries={['/']} initialIndex={0}>
            <Routes>
              <Route path="/foo/bar" element={<DocumentMutator />}></Route>
              <Route path="*" element={<Link to="/foo/bar">/foo/bar</Link>}></Route>
            </Routes>
            <ChromeProvider />
          </MemoryRouter>
        </ScalprumContext.Provider>
      );
    });
    // change location
    act(() => {
      screen.getByText('/foo/bar').click();
    });

    // debounce timer
    // wait for calls to be finished
    await act(async () => {
      await jest.advanceTimersByTime(5001);
    });
    // should be called anly once because of the debounce
    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenLastCalledWith('/api/chrome-service/v1/last-visited', {
      pathname: '/foo/bar',
      title: 'Foo title',
      bundle: 'bundle-title',
    });
  }, 10000);

  test('should not update state on mount if received error response', async () => {
    const errorResponse = { errors: [{ status: 404, meta: { response_by: 'gateway' }, detail: 'Undefined Insights application' }] };
    getSpy.mockRejectedValue(errorResponse);
    postSpy.mockRejectedValue(errorResponse);
    // do not polute console with errors
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation(() => undefined);
    await act(async () => {
      await render(
        <MemoryRouter>
          <ScalprumContext.Provider
            value={{
              config: {},
              initialized: true,
              pluginStore: new PluginStore(),
              api: {
                chrome: {
                  getBundleData: () => ({
                    bundleTitle: 'bundle-title',
                  }),
                },
              },
            }}
          >
            <ChromeProvider />
          </ScalprumContext.Provider>
        </MemoryRouter>
      );
    });

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy.mock.calls).toEqual([['Unable to initialize ChromeProvider!', errorResponse]]);
    consoleSpy.mockRestore();
  });
});
