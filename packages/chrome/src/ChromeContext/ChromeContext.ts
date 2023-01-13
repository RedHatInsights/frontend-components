import { createContext } from 'react';
import chromeState from '../ChromeProvider/chromeState';

const ChromeContext = createContext<ReturnType<typeof chromeState>>({
  update: () => undefined,
  setLastVisited: () => undefined,
  setFavouritePages: () => undefined,
  subscribe: () => 0,
  unsubscribe: () => undefined,
  getState: () => ({
    lastVisitedPages: [],
    subscribtions: {},
    favoritePages: [],
  }),
});

export default ChromeContext;
