export type FavoritePage = {
  pathname: string;
  favorite: boolean;
};

export type LastVisitedPage = {
  pathname: string;
  title: string;
  bundle: string;
};

export type VisitedBundles = { [bundle: string]: true };

export type UserIdentity = {
  lastVisitedPages: LastVisitedPage[];
  favoritePages: FavoritePage[];
  visitedBundles: VisitedBundles;
};

export enum UpdateEvents {
  lastVisited = 'lastVisited',
  favoritePages = 'favoritePages',
  visitedBundles = 'visitedBundles',
}

const chromeState = () => {
  let state: UserIdentity = {
    lastVisitedPages: [],
    favoritePages: [],
    visitedBundles: {},
  };

  // registry of all subscribers (hooks)
  const subscribtions: {
    [key in UpdateEvents]: {
      onUpdate: () => void;
    }[];
  } = {
    lastVisited: [],
    favoritePages: [],
    visitedBundles: [],
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
  function update(event: UpdateEvents, attributes: Partial<UserIdentity>) {
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

  function setVisitedBundles(visitedBundles: VisitedBundles) {
    update(UpdateEvents.visitedBundles, { visitedBundles });
  }

  function getState() {
    return state;
  }

  // initializes state with new identity and should trigger all updates
  function setIdentity(userIdentity: UserIdentity) {
    state = userIdentity;
    Object.values(subscribtions)
      .flat()
      .forEach((sub) => {
        sub.onUpdate();
      });
  }

  // public state manager interface
  return {
    getState,
    setLastVisited,
    setIdentity,
    setFavoritePages,
    setVisitedBundles,
    subscribe,
    unsubscribe,
    update,
  };
};

export default chromeState;
