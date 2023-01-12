import { useContext, useEffect, useReducer } from 'react';

import { ChromeContext } from '../ChromeContext';
import { UpdateEvents } from '../ChromeProvider';

const useLastVisited = () => {
  const { subscribe, unsubscribe, getState } = useContext(ChromeContext);
  const [, forceRender] = useReducer((count) => count + 1, 0);

  useEffect(() => {
    const subsId = subscribe(UpdateEvents.lastVisited, forceRender);
    return () => {
      unsubscribe(subsId, UpdateEvents.lastVisited);
    };
  }, []);
  return getState().lastVisitedPages;
};

export default useLastVisited;
