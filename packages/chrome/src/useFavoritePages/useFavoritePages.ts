import { useContext, useEffect, useReducer } from 'react';
import { UpdateEvents } from '../ChromeProvider';
import { FavoritePage } from '../ChromeProvider/chromeState';
import { FAVORITE_PAGE_URL, post } from '../utils/fetch';
import ChromeContext from '../ChromeContext/ChromeContext';

function handleFavoritePage(pathname: string, favorite: boolean) {
  return post<FavoritePage[], FavoritePage>(FAVORITE_PAGE_URL, {
    pathname,
    favorite,
  });
}

const useFavoritePages = () => {
  const { subscribe, unsubscribe, getState, setFavoritePages } = useContext(ChromeContext);
  const [, forceRender] = useReducer((count) => count + 1, 0);

  async function handleFavoriteAPICall(pathname: string, favorite: boolean) {
    const prevPages = getState().favoritePages;
    try {
      // optimistic update before API request is finished
      setFavoritePages([...prevPages, { pathname, favorite }]);
      const newPages = await handleFavoritePage(pathname, favorite);
      // update with actual favorite pagse result
      setFavoritePages(newPages);
      return newPages;
    } catch (error) {
      // unable to update the favorite page for some reason, return to previous state
      console.error(error);
      setFavoritePages(prevPages);
      return prevPages;
    }
  }

  async function favoritePage(pathname: string) {
    return handleFavoriteAPICall(pathname, true);
  }

  function unfavoritePage(pathname: string) {
    return handleFavoriteAPICall(pathname, false);
  }

  useEffect(() => {
    const subsId = subscribe(UpdateEvents.favoritePages, forceRender);
    return () => {
      unsubscribe(subsId, UpdateEvents.favoritePages);
    };
  }, []);
  return { favoritePages: getState().favoritePages, favoritePage, unfavoritePage, initialized: getState().initialized };
};

export default useFavoritePages;
