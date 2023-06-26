import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ChromeContext } from '../ChromeContext';
import chromeState, { LastVisitedPage, UserIdentity } from './chromeState';
import { IDENTITY_URL, LAST_VISITED_URL, get, post } from '../utils/fetch';

const getUserIdentity = () => get<UserIdentity>(IDENTITY_URL);

const useLastPageVisitedUploader = (providerState: ReturnType<typeof chromeState>, bundle = '') => {
  const { pathname } = useLocation();
  useEffect(() => {
    post<LastVisitedPage[], { pathname: string; title: string; bundle: string }>(LAST_VISITED_URL, {
      pathname,
      title: document.title,
      bundle,
    })
      .then((data) => providerState.setLastVisited(data))
      .catch((error) => console.error('Unable to update last visited pages!', error));
  }, [pathname]);
};

const ChromeProvider: React.FC<{ bundle?: string; children?: React.ReactNode }> = ({ children, bundle }) => {
  const isMounted = useRef(false);
  const [initialRequest, setInitialRequest] = useState(false);
  const providerState = useRef<ReturnType<typeof chromeState>>();
  if (!providerState.current) {
    providerState.current = chromeState();
  }

  useLastPageVisitedUploader(providerState.current, bundle);

  useEffect(() => {
    isMounted.current = true;
    if (!initialRequest) {
      getUserIdentity()
        .then((identity) => {
          if (isMounted.current) {
            providerState.current?.setIdentity(identity);
            setInitialRequest(true);
          }
        })
        .catch((error) => {
          console.error('Unable to initialize ChromeProvider!', error);
        });
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  return <ChromeContext.Provider value={providerState.current}>{children}</ChromeContext.Provider>;
};

export default ChromeProvider;
