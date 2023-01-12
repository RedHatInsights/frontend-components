export type ChromeContextState = {
  lastVisitedPages: string[];
};

export enum UpdateEvents {
  lastVisited = 'lastVisited',
}

const chromeState = () => {
  let state: ChromeContextState = {
    lastVisitedPages: [],
  };
  // registry of all subscribers (hooks)
  const subscribtions: {
    [key in UpdateEvents]: {
      onUpdate: () => void;
    }[];
  } = {
    lastVisited: [],
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
  function setLastVisited(pages: string[]) {
    update(UpdateEvents.lastVisited, { lastVisitedPages: pages });
  }

  function getState() {
    return state;
  }

  // public state manager interface
  return {
    getState,
    setLastVisited,
    subscribe,
    unsubscribe,
    update,
  };
};

export default chromeState;
