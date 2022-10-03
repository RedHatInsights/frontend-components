import { ActionCreator, Middleware, Reducer, Store, applyMiddleware, combineReducers, compose, createStore } from 'redux';

export function applyReducerHash(reducerHash: any, initialState: Record<string, unknown> = {}) {
  return function (state = initialState, action: { type: PropertyKey }) {
    if (Object.prototype.hasOwnProperty.call(reducerHash, action.type)) {
      return reducerHash[action.type](state, action);
    }

    return state;
  };
}

export function dispatchActionsToStore<T extends Record<string, ActionCreator<any>>>(actions: Record<string, ActionCreator<any>>, store: Store): T {
  return Object.keys(actions).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: (...passTrough: any) => store && store.dispatch(actions[curr](...passTrough)),
    }),
    {} as T
  );
}

/**
 * Class used to added reducers to the store during runtime.
 *
 * http://nicolasgallagher.com/redux-modules-and-code-splitting/
 */

declare global {
  interface Window {
    REDUX_DEVTOOLS_EXTENSION_COMPOSE?: typeof compose;
  }
}

export class ReducerRegistry<T extends Record<string, any>> {
  store: Store;
  reducers: Record<string, Reducer>;
  constructor(initState: T = {} as T, middlewares: Middleware[] = [], composeEnhancersDefault = compose) {
    const composeEnhancers =
      (typeof window !== 'undefined' && (window.REDUX_DEVTOOLS_EXTENSION_COMPOSE as typeof compose)) || composeEnhancersDefault;
    this.store = createStore((state = initState) => state, initState as any, composeEnhancers(applyMiddleware(...middlewares)));
    this.reducers = {};
  }

  getStore(): Store<T> {
    return this.store;
  }

  register(newReducers: Record<string, Reducer>) {
    this.reducers = { ...this.reducers, ...newReducers };
    this.store.replaceReducer(combineReducers({ ...this.reducers }));
    return () => {
      this.reducers = Object.entries(this.reducers)
        .filter(([reducer]) => !Object.keys(newReducers).includes(reducer))
        .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
      this.store.replaceReducer(combineReducers({ ...this.reducers }));
    };
  }
}

export const reduxRegistry = new ReducerRegistry();

export default ReducerRegistry;
