import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlag } from '@unleash/proxy-client-react';

import { ChromeContext } from '../ChromeContext';
import chromeState, { FavoritePage, LastVisitedPage } from './chromeState';
import { FAVORITE_PAGE_URL, LAST_VISITED_URL, get, post } from '../utils/fetch';

const getLastVisited = () => get<LastVisitedPage[]>(LAST_VISITED_URL);
const getFavoritePages = () => get<FavoritePage[]>(`${FAVORITE_PAGE_URL}?getAll=true`);

const useLastPageVisitedUploader = (providerState: ReturnType<typeof chromeState>, chromeBackendEnabled?: boolean, bundle = '') => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (chromeBackendEnabled) {
      post<LastVisitedPage[], { pathname: string; title: string; bundle: string }>(LAST_VISITED_URL, {
        pathname,
        title: document.title,
        bundle,
      }).then((data) => providerState.setLastVisited(data));
    }
  }, [pathname]);
};

const ChromeProvider: React.FC<{ bundle?: string }> = ({ children, bundle }) => {
  const chromeBackendEnabled = useFlag('platform.chrome.chrome-service');
  const isMounted = useRef(false);
  const [initialRequest, setInitialRequest] = useState(false);
  const providerState = useRef<ReturnType<typeof chromeState>>();
  if (!providerState.current) {
    providerState.current = chromeState();
  }

  useLastPageVisitedUploader(providerState.current, chromeBackendEnabled, bundle);

  useEffect(() => {
    isMounted.current = true;
    if (chromeBackendEnabled && !initialRequest) {
      Promise.all([getLastVisited(), getFavoritePages()]).then(([lastVisited, favoritePages]) => {
        if (isMounted.current) {
          providerState.current?.setLastVisited(lastVisited);
          providerState.current?.setFavoritePages(favoritePages);
          setInitialRequest(true);
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [chromeBackendEnabled]);

  return <ChromeContext.Provider value={providerState.current}>{children}</ChromeContext.Provider>;
};

export default ChromeProvider;
