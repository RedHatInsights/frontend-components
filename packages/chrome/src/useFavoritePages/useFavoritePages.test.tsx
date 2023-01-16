import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import ChromeContext from '../ChromeContext';
import chromeState from '../ChromeProvider/chromeState';
import useFavoritePages from './useFavoritePages';
import * as fetch from '../utils/fetch';

describe('useFavoritePages', () => {
  const getStateSpy = jest.fn().mockReturnValue({
    favoritePages: [],
  });
  const setFavoritePagesSpy = jest.fn();
  const setLastVisitedSpy = jest.fn();
  const subscribeSpy = jest.fn();
  const unsubscribeSpy = jest.fn();
  const updateSpy = jest.fn();
  const postSpy = jest.spyOn(fetch, 'post');
  const initialProps: ReturnType<typeof chromeState> = {
    getState: getStateSpy,
    setFavoritePages: setFavoritePagesSpy,
    setLastVisited: setLastVisitedSpy,
    subscribe: subscribeSpy,
    unsubscribe: unsubscribeSpy,
    update: updateSpy,
  };

  beforeEach(() => {
    getStateSpy.mockReset().mockReturnValue({
      favoritePages: [],
    });
    setFavoritePagesSpy.mockReset();
    setLastVisitedSpy.mockReset();
    subscribeSpy.mockReset();
    unsubscribeSpy.mockReset();
    updateSpy.mockReset();
    postSpy.mockReset();
  });

  test('should subscribe to last visited pages on mount ', () => {
    (initialProps.subscribe as jest.Mock).mockImplementationOnce(() => 111);
    const wrapper = ({ children }: { children: any }) => <ChromeContext.Provider value={initialProps}>{children}</ChromeContext.Provider>;
    const { unmount } = renderHook(() => useFavoritePages(), { wrapper });

    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    expect(subscribeSpy).toHaveBeenCalledWith('favoritePages', expect.any(Function));

    unmount();
    expect(unsubscribeSpy).toHaveBeenCalledTimes(1);
    expect(unsubscribeSpy).toHaveBeenLastCalledWith(111, 'favoritePages');
  });

  test('should send correct payload to favorite page POST request', async () => {
    const wrapper = ({ children }: { children: any }) => <ChromeContext.Provider value={initialProps}>{children}</ChromeContext.Provider>;

    const { result } = renderHook(() => useFavoritePages(), { wrapper });
    await result.current.favoritePage('/foo/bar');

    expect(postSpy).toHaveBeenCalledTimes(1);
    expect(postSpy).toHaveBeenCalledWith('/api/chrome-service/v1/favorite-pages', { favorite: true, pathname: '/foo/bar' });

    await result.current.unfavoritePage('/foo/bar');

    expect(postSpy).toHaveBeenCalledTimes(2);
    expect(postSpy).toHaveBeenLastCalledWith('/api/chrome-service/v1/favorite-pages', { favorite: false, pathname: '/foo/bar' });
  });
});
