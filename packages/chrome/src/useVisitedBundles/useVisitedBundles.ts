import { useContext, useEffect, useReducer } from 'react';
import { UpdateEvents } from '../ChromeProvider';
import { UserIdentity, VisitedBundles } from '../ChromeProvider/chromeState';
import { VISITED_BUNDLES_URL, post } from '../utils/fetch';
import ChromeContext from '../ChromeContext/ChromeContext';

function handleMarkVisited(bundle: string) {
  return post<UserIdentity, { bundle: string }>(VISITED_BUNDLES_URL, {
    bundle,
  });
}

const useVisitedBundles = () => {
  const { subscribe, unsubscribe, getState, setVisitedBundles } = useContext(ChromeContext);
  const [, forceRender] = useReducer((count) => count + 1, 0);

  async function markVisited(bundle: string): Promise<VisitedBundles> {
    const shouldMarkVisited = !getState().visitedBundles?.[bundle];
    if (shouldMarkVisited) {
      const updatedUser = await handleMarkVisited(bundle);
      setVisitedBundles(updatedUser.visitedBundles);
      return updatedUser.visitedBundles;
    }

    return getState().visitedBundles;
  }

  useEffect(() => {
    const subsId = subscribe(UpdateEvents.visitedBundles, forceRender);
    return () => {
      unsubscribe(subsId, UpdateEvents.visitedBundles);
    };
  }, []);
  return { visitedBundles: getState().visitedBundles, markVisited };
};

export default useVisitedBundles;
