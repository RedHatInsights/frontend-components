import React, { useEffect, useRef, useState } from 'react';
import { useScalprum } from '@scalprum/react-core';
import { useLocation } from 'react-router-dom';
import { ChromeContext } from '../ChromeContext';
import chromeState, { LastVisitedPage, UserIdentity } from './chromeState';
import { IDENTITY_URL, LAST_VISITED_URL, get, post } from '../utils/fetch';

const getUserIdentity = () => get<UserIdentity>(IDENTITY_URL);

const useLastPageVisitedUploader = (providerState: ReturnType<typeof chromeState>) => {
  const inactiveDuration = 1000 * 20;
  const batchUpdateInterval = 1000 * 60 * 3;
  // There was some lint and namespacing weirdness with ChromeAPI and NodeJS.Timeout so
  // we're grabbing the type without managing another import or adding anything to tsconfig.
  const inactiveTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const postBatchData = async (recentPages: LastVisitedPage[]) => {
    try {
      await post<LastVisitedPage[], { pages: LastVisitedPage[] }>(LAST_VISITED_URL, {
        pages: recentPages,
      });
    } catch (error) {
      console.error('Unable to update last visited pages!', error);
    }
  };

  const sanitizeRecentPages = (recentPages: LastVisitedPage[]): LastVisitedPage[] => {
    return recentPages.map(({ pathname, title, bundle }) => ({ pathname, title, bundle }));
  };

  const clearInactiveTimeout = () => {
    if (inactiveTimeout.current !== undefined) {
      clearTimeout(inactiveTimeout.current);
      inactiveTimeout.current = undefined;
    }
  };

  const updateMostRecentPages = async () => {
    const recentPages = providerState.getState().lastVisitedPages;
    const sanitizedPages: LastVisitedPage[] = sanitizeRecentPages(recentPages);
    await postBatchData(sanitizedPages);
  };

  useEffect(() => {
    // Save state from localStorage on an interval
    const updateInterval = setInterval(async () => {
      updateMostRecentPages();
    }, batchUpdateInterval);

    const handleVisibilityChange = () => {
      // Tab is reported as inactive
      if (document.visibilityState !== 'visible') {
        // Don't duplicate timer
        if (inactiveTimeout.current) {
          return;
        }
        // Start the timer to send when user is away for the interval
        inactiveTimeout.current = setTimeout(async () => {
          updateMostRecentPages();
        }, inactiveDuration);
      } else {
        // User has returned before the timeout duration, clear the timer
        clearInactiveTimeout();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(updateInterval);
      clearInactiveTimeout();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};

const LAST_VISITED_FLAG = 'chrome:lastVisited';

const useLastVisitedLocalStorage = (providerState: ReturnType<typeof chromeState>) => {
  const { pathname } = useLocation();
  const scalprum = useScalprum();
  const titleTarget = document.querySelector('title');
  const lastVisitedLocal = localStorage.getItem(LAST_VISITED_FLAG);
  useEffect(() => {
    const getInitialPages = async () => {
      try {
        if (!lastVisitedLocal) {
          const firstPages: LastVisitedPage[] = await get<LastVisitedPage[]>(LAST_VISITED_URL);
          if (firstPages) {
            providerState.setLastVisited(firstPages);
            try {
              localStorage.setItem(LAST_VISITED_FLAG, JSON.stringify(firstPages));
            } catch (error) {
              console.error('Unable to load initial last visited pages!', error);
            }
          }
        } else {
          const lastVisited: LastVisitedPage[] = JSON.parse(localStorage.getItem(LAST_VISITED_FLAG) ?? '[]');
          if (!Array.isArray(lastVisited)) {
            localStorage.setItem(LAST_VISITED_FLAG, JSON.stringify([]));
            providerState.setLastVisited([]);
          } else {
            providerState.setLastVisited(lastVisited);
          }
        }
      } catch (error: any) {
        console.error('Unable to parse last visited pages from localStorage!', error);
        providerState.setLastVisited([]);
        localStorage.setItem(LAST_VISITED_FLAG, JSON.stringify([]));
      }
    };
    getInitialPages();
  }, []);

  useEffect(() => {
    let titleObserver: MutationObserver | undefined;
    let prevTitle: string | null;

    if (titleTarget) {
      titleObserver = new MutationObserver((mutations) => {
        // grab text from the title element
        const currentTitle = mutations[0]?.target.textContent;
        // trigger only if the titles are different
        if (typeof currentTitle === 'string' && currentTitle !== prevTitle) {
          try {
            prevTitle = currentTitle;
            const newTitles = providerState.getState().lastVisitedPages.filter((item) => item.pathname !== pathname);
            newTitles.unshift({ pathname, title: currentTitle, bundle: scalprum.api?.chrome.getBundleData().bundleTitle });
            providerState.setLastVisited(newTitles.slice(0, 10));

            localStorage.setItem(LAST_VISITED_FLAG, JSON.stringify(newTitles.slice(0, 10)));
          } catch (error) {
            // catch sync errors
            console.error('Unable to update last visited pages!', error);
          }
        }
      });

      titleObserver.observe(titleTarget, {
        childList: true,
      });
    }
    return () => {
      titleObserver?.disconnect();
    };
  }, [pathname]);
};

const ChromeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isMounted = useRef(false);
  const [initialRequest, setInitialRequest] = useState(false);
  const providerState = useRef<ReturnType<typeof chromeState>>();
  if (!providerState.current) {
    providerState.current = chromeState();
  }

  useLastVisitedLocalStorage(providerState.current);
  useLastPageVisitedUploader(providerState.current);

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
