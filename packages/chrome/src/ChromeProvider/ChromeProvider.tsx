import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlag } from '@unleash/proxy-client-react';

import { ChromeContext } from '../ChromeContext';
import chromeState from './chromeState';
import { get, post } from '../utils/fetch';

const getLastVisited = () => get<string[]>('/api/chrome-service/v1/last-visited');

const useLastPageVisitedUploader = (providerState: ReturnType<typeof chromeState>, chromeBackendEnabled?: boolean) => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (chromeBackendEnabled) {
      post<string[], { pathname: string; title: string }>('/api/chrome-service/v1/last-visited', {
        pathname,
        title: document.title,
      }).then((data) => providerState.setLastVisited(data));
    }
  }, [pathname]);
};

const ChromeProvider: React.FC = ({ children }) => {
  const chromeBackendEnabled = useFlag('platform.chrome.chrome-service');
  const isMounted = useRef(false);
  const [initialRequest, setInitialRequest] = useState(false);
  const providerState = useRef<ReturnType<typeof chromeState>>();
  if (!providerState.current) {
    providerState.current = chromeState();
  }

  useLastPageVisitedUploader(providerState.current, chromeBackendEnabled);

  useEffect(() => {
    isMounted.current = true;
    if (chromeBackendEnabled && !initialRequest) {
      getLastVisited().then((lastVisited) => {
        if (isMounted.current) {
          providerState.current?.setLastVisited(lastVisited);
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

<ChromeProvider>
  <div>Foo bar</div>
</ChromeProvider>;
