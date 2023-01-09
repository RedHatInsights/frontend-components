import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useFlag } from '@unleash/proxy-client-react';
import { ChromeContext } from '../ChromeContext';

const useLastPageVisitedUploader = () => {
  const chromeBackendEnabled = useFlag('platform.chrome.chrome-service');
  const { pathname } = useLocation();
  useEffect(() => {
    if (chromeBackendEnabled) {
      fetch('/api/chrome-service/v1/last-visited', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          pathname,
          title: document.title,
        }),
      });
    }
  }, [pathname]);
};

const ChromeProvider: React.FC = ({ children }) => {
  useLastPageVisitedUploader();
  return <ChromeContext.Provider value={{}}>{children}</ChromeContext.Provider>;
};

export default ChromeProvider;

<ChromeProvider>
  <div>Foo bar</div>
</ChromeProvider>;
