import { createContext } from 'react';
import chromeState from '../ChromeProvider/chromeState';

const ChromeContext = createContext<ReturnType<typeof chromeState>>({
  update: () => undefined,
  setLastVisited: () => undefined,
  setFavoritePages: () => undefined,
  subscribe: () => Symbol(0),
  unsubscribe: () => undefined,
  setIdentity: () => undefined,
  setVisitedBundles: () => undefined,
  getState: () => ({
    lastVisitedPages: [],
    subscribtions: {},
    favoritePages: [],
    visitedBundles: {},
  }),
});

export default ChromeContext;
