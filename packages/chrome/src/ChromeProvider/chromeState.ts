export type FavoritePage = {
  pathname: string;
  favorite: boolean;
};

export type LastVisitedPage = {
  pathname: string;
  title: string;
  bundle: string;
};

export type ChromeContextState = {
  lastVisitedPages: LastVisitedPage[];
  favoritePages: FavoritePage[];
};

export enum UpdateEvents {
  lastVisited = 'lastVisited',
  favoritePages = 'favoritePages',
}

const chromeState = () => {
  let state: ChromeContextState = {
    lastVisitedPages: [],
    favoritePages: [],
  };

  // registry of all subscribers (hooks)
  const subscribtions: {
    [key in UpdateEvents]: {
      onUpdate: () => void;
    }[];
  } = {
    lastVisited: [],
    favoritePages: [],
  };

  // add subscriber (hook) to registry
  function subscribe(event: UpdateEvents, onUpdate: () => void) {
    // get id of a new subscriber
    const id = subscribtions[event].length;
    // add new subscriber
    subscribtions[event].push({ onUpdate });
    // trigger initial update to get the initial data
    onUpdate();
    return id;
  }

  // remove subscriber from registry
  function unsubscribe(id: number, event: UpdateEvents) {
    if (id < subscribtions[event].length) {
      subscribtions[event].splice(id, 1);
    } else {
      console.error('Trying to unsubscribe client outside of the range!');
    }
  }

  // update state attribute and push data to subscribers
  function update(event: UpdateEvents, attributes: Partial<ChromeContextState>) {
    state = {
      ...state,
      ...attributes,
    };
    const updateSubscriptions = subscribtions[event];
    if (updateSubscriptions.length === 0) {
      return;
    }

    // update the subscribed clients
    updateSubscriptions.forEach(({ onUpdate }) => {
      onUpdate();
    });
  }

  // last visited update event wrapper
  function setLastVisited(pages: LastVisitedPage[]) {
    update(UpdateEvents.lastVisited, { lastVisitedPages: pages });
  }

  function setFavoritePages(pages: FavoritePage[]) {
    update(UpdateEvents.favoritePages, { favoritePages: pages });
  }

  function getState() {
    return state;
  }

  // public state manager interface
  return {
    getState,
    setLastVisited,
    setFavoritePages,
    subscribe,
    unsubscribe,
    update,
  };
};

export default chromeState;
