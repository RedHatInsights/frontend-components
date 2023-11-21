import React, { useEffect, useRef, useState } from 'react';
import { useScalprum } from '@scalprum/react-core';
import { ChromeAPI } from '@redhat-cloud-services/types';
import { useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';

import { ChromeContext } from '../ChromeContext';
import chromeState, { LastVisitedPage, UserIdentity } from './chromeState';
import { IDENTITY_URL, LAST_VISITED_URL, get, post } from '../utils/fetch';

const getUserIdentity = () => get<UserIdentity>(IDENTITY_URL);
const postDataDebounced = debounce(async (pathname: string, title: string, bundle: string) => {
  const data = await post<LastVisitedPage[], { pathname: string; title: string; bundle: string }>(LAST_VISITED_URL, {
    pathname,
    title,
    bundle,
  });
  return data;
  // count page as visited after 5 second of being on the page
  // should help limit number of API calls
}, 5000);

// FIXME: Use this hook once the issues with dead locking are resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useLastPageVisitedUploader = (providerState: ReturnType<typeof chromeState>) => {
  const scalprum = useScalprum<{ initialized: boolean; api: { chrome: ChromeAPI } }>();
  const { pathname } = useLocation();
  const postData = async (pathname: string, title: string, bundle: string) => {
    try {
      const data = await postDataDebounced(pathname, title, bundle);
      if (data) {
        providerState.setLastVisited(data);
      }
    } catch (error) {
      console.error('Unable to update last visited pages!', error);
    }
  };
  useEffect(() => {
    let titleObserver: MutationObserver | undefined;
    let prevTitle: string | null;
    const titleTarget = document.querySelector('title');
    if (titleTarget) {
      prevTitle = titleTarget.textContent;
      // initial api call on mount
      postData(pathname, prevTitle ?? '', scalprum.api.chrome.getBundleData().bundleTitle);
      /**
       * Use Mutation observer to trigger the updates.
       * Using the observer will ensure the last visited pages gets updated on document title change rather than just location change.
       * The chrome service uses pathname as identifier and updates title according.
       * Multiple calls with the same pathname and different title will ensure that the latest correct title is assigned to a pathname.       *
       *  */
      titleObserver = new MutationObserver((mutations) => {
        // grab text from the title element
        const currentTitle = mutations[0]?.target.textContent;
        // trigger only if the titles are different
        if (typeof currentTitle === 'string' && currentTitle !== prevTitle) {
          try {
            prevTitle = currentTitle;
            postData(pathname, currentTitle, scalprum.api.chrome.getBundleData().bundleTitle);
          } catch (error) {
            // catch sync errors
            console.error('Unable to update last visited pages!', error);
          }
        }
      });
      titleObserver.observe(titleTarget, {
        // observe only the children
        childList: true,
      });
    }
    return () => {
      titleObserver?.disconnect();
      postDataDebounced?.cancel();
    };
  }, [pathname]);
};

const LAST_VISITED_FLAG = 'chrome:lastVisited';

const useLastVisitedLocalStorage = (providerState: ReturnType<typeof chromeState>) => {
  const { pathname } = useLocation();
  const scalprum = useScalprum();
  const titleTarget = document.querySelector('title');
  useEffect(() => {
    let titleObserver: MutationObserver | undefined;
    let prevTitle: string | null;
    const lastVisited = localStorage.getItem(LAST_VISITED_FLAG);
    if (lastVisited) {
      try {
        const lastVisited: LastVisitedPage[] = JSON.parse(localStorage.getItem(LAST_VISITED_FLAG) ?? '[]');
        if (!Array.isArray(lastVisited)) {
          localStorage.setItem(LAST_VISITED_FLAG, JSON.stringify([]));
          providerState.setLastVisited([]);
        } else {
          providerState.setLastVisited(lastVisited);
        }
      } catch (error) {
        console.error('Unable to parse last visited pages from localStorage!', error);
        providerState.setLastVisited([]);
        localStorage.setItem(LAST_VISITED_FLAG, JSON.stringify([]));
      }
    }

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
