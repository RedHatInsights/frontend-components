import { createContext } from 'react';
import chromeState from '../ChromeProvider/chromeStateManager';

const ChromeContext = createContext<ReturnType<typeof chromeState>>({
  update: () => undefined,
  setLastVisited: () => undefined,
  subscribe: () => 0,
  unsubscribe: () => undefined,
  getState: () => ({
    lastVisitedPages: [],
    subscribtions: {},
  }),
});

export default ChromeContext;
