import React from 'react';
import { renderHook } from '@testing-library/react';

import ChromeContext from '../ChromeContext';
import chromeState from '../ChromeProvider/chromeState';
import useVisitedBundles from './useVisitedBundles';
import * as fetch from '../utils/fetch';

describe('useVisitedBundles', () => {
  const getStateSpy = jest.fn().mockReturnValue({
    favoritePages: [],
  });
  const setFavoritePagesSpy = jest.fn();
  const setLastVisitedSpy = jest.fn();
  const subscribeSpy = jest.fn();
  const unsubscribeSpy = jest.fn();
  const updateSpy = jest.fn();
  const setIdentitySpy = jest.fn();
  const setVisitedBundlesSpy = jest.fn();

  const postSpy = jest.spyOn(fetch, 'post');
  const initialProps: ReturnType<typeof chromeState> = {
    getState: getStateSpy,
    setFavoritePages: setFavoritePagesSpy,
    setLastVisited: setLastVisitedSpy,
    subscribe: subscribeSpy,
    unsubscribe: unsubscribeSpy,
    update: updateSpy,
    setIdentity: setIdentitySpy,
    setVisitedBundles: setVisitedBundlesSpy,
  };

  beforeEach(() => {
    getStateSpy.mockReset().mockReturnValue({
      visitedBundles: {},
    });
    setFavoritePagesSpy.mockReset();
    setLastVisitedSpy.mockReset();
    subscribeSpy.mockReset();
    unsubscribeSpy.mockReset();
    updateSpy.mockReset();
    setVisitedBundlesSpy.mockReset();
    setIdentitySpy.mockReset();
    postSpy.mockReset();
  });

  test('should subscribe to last visited pages on mount ', () => {
    (initialProps.subscribe as jest.Mock).mockImplementationOnce(() => 111);
    const wrapper = ({ children }: { children: any }) => <ChromeContext.Provider value={initialProps}>{children}</ChromeContext.Provider>;
    const { unmount } = renderHook(() => useVisitedBundles(), { wrapper });

    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy).toHaveBeenCalledWith('visitedBundles', expect.any(Function));

    unmount();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenLastCalledWith(111, 'visitedBundles');
  });

  test('should send correct payload to visited bundles POST request', async () => {
    const wrapper = ({ children }: { children: any }) => <ChromeContext.Provider value={initialProps}>{children}</ChromeContext.Provider>;

    const { result } = renderHook(() => useVisitedBundles(), { wrapper });
    postSpy.mockImplementationOnce(() =>
      Promise.resolve({
        visitedBundles: {
          insights: true,
        },
      })
    );

    // first API call
    await result.current.markVisited('insights');
    expect(postSpy).toHaveBeenCalledWith(fetch.VISITED_BUNDLES_URL, { bundle: 'insights' });
    expect(setVisitedBundlesSpy).toHaveBeenCalledWith({ insights: true });
  });

  test('should not call post request if bundle is already marked as visited', async () => {
    const wrapper = ({ children }: { children: any }) => (
      <ChromeContext.Provider
        value={{
          ...initialProps,
          getState: () => ({
            // mark singits as already visited
            visitedBundles: {
              insights: true,
            },
            favoritePages: [],
            lastVisitedPages: [],
            initialized: true,
          }),
        }}
      >
        {children}
      </ChromeContext.Provider>
    );

    const { result } = renderHook(() => useVisitedBundles(), { wrapper });

    // first API call
    await result.current.markVisited('insights');
    expect(postSpy).not.toHaveBeenCalled();
    expect(setVisitedBundlesSpy).not.toHaveBeenCalled();
  });
});
