import { useContext } from 'react';
import { useHistory as routerUseHistory } from 'react-router-dom';
import chromeRouterContext from '../chromeRouterContext';

const useHistory = () => {
  const { removePathPrefix, prependTo } = useContext(chromeRouterContext);
  const internalHistory = routerUseHistory();
  let internalRemovePathPrefix = typeof removePathPrefix === 'function' ? removePathPrefix : (path) => path;
  let internalPrependTo = typeof prependTo === 'function' ? prependTo : (path) => path;

  let location = {
    ...internalHistory.location,
    pathname: internalRemovePathPrefix(internalHistory.location.pathname),
  };

  const push = (path, state, ignoreBasename = false) => internalHistory.push(ignoreBasename ? path : internalPrependTo(path), state);

  const replace = (path, state, ignoreBasename = false) => internalHistory.replace(ignoreBasename ? path : internalPrependTo(path), state);

  return {
    ...internalHistory,
    location,
    push,
    replace,
  };
};

export default useHistory;
