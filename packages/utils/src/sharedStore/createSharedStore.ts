export type SharedStoreConfig<S, E extends readonly string[]> = {
  initialState: S;
  events: E;
  onEventChange: (prevState: S, event: E[number], payload?: any) => S;
}

const ALL_EVENTS = '*';

function validateConfig<S, E extends readonly string[]>(config: SharedStoreConfig<S, E>) {
  if(typeof config.initialState === 'undefined') {
    throw new Error('Initial state must be provided to create a shared store');
  }
  if(!config.events) {
    throw new Error('Events must be provided to create a shared store');
  }
  if(!config.onEventChange) {
    throw new Error('onEventChange callback must be provided to create a shared store');
  }

  if(config.events.length === 0) {
    throw new Error('At least one event must be defined to create a shared store');
  }

  if(config.events.includes(ALL_EVENTS)) {
    throw new Error(`Event name "${ALL_EVENTS}" is reserved and cannot be used as an event name`);
  }

  const invalidEvent = config.events.find(event => typeof event !== 'string');
  if(invalidEvent) {
    throw new Error(`Event names must be of type string, received ${typeof invalidEvent}: "${invalidEvent}"`);
  }
}

export function createSharedStore<S, E extends readonly any[]>(config: SharedStoreConfig<S, E>) {
  validateConfig(config);
  let state: S = config.initialState;
  const subs: {[event in E[number] | typeof ALL_EVENTS]?: {[uuid: string]: () => void}} = {
    [ALL_EVENTS]: {}
  };


  const getState = () => state;

  function subscribe(event: E[number], callback: () => void) {
    if(!subs[event]) {
      subs[event] = {};
    }
    const uuid = crypto.randomUUID();
    subs[event][uuid] = callback;
    return () => {
      if(subs[event]?.[uuid]) {
        delete subs[event][uuid];
      }
    }
  }

  function notify(event: E[number]) {
    if(subs[event]) {
      Object.values(subs[event]).forEach(cb => cb());
    }
  }

  function notifyAll() {
    if(subs[ALL_EVENTS]) {
      Object.values(subs[ALL_EVENTS]).forEach(cb => cb());
    }
  }

  function updateState(event: E[number], payload?: any) { 
    state = config.onEventChange(state, event, payload);
    notify(event);
    notifyAll();
  }

  function subscribeAll(callback: () => void) {
    if(!subs[ALL_EVENTS]) {
      subs[ALL_EVENTS] = {};
    }
    const uuid = crypto.randomUUID();
    subs[ALL_EVENTS][uuid] = callback;
    return () => {
      if(subs[ALL_EVENTS]?.[uuid]) {
        delete subs[ALL_EVENTS][uuid];
      }
    }
  }

  return {
    getState,
    updateState,
    subscribe,
    subscribeAll,
  };
}
