import { createContext } from 'react';

const chromeRouterContext = createContext({ basename: '/' });

export const ChromeRouterProvider = chromeRouterContext.Provider;
export const ChromeRouterConsumer = chromeRouterContext.Consumer;
export default chromeRouterContext;
