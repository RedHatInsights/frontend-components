/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyMiddleware, combineReducers, createStore, compose } from 'redux';

export function applyReducerHash(reducerHash: any, initialState: Record<string, unknown>) {
  return function (state = initialState, action: { type: PropertyKey }) {
    if (Object.prototype.hasOwnProperty.call(reducerHash, action.type)) {
      return reducerHash[action.type](state, action);
    }

    return state;
  };
}

export function dispatchActionsToStore(actions: any, store: any) {
  return Object.keys(actions).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: (...passTrough: any) => store && store.dispatch(actions[curr](...passTrough)),
    }),
    {}
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

export class ReducerRegistry {
  store: any;
  reducers: Record<string, never>;
  constructor(initState = {} as unknown as any, middlewares = [], composeEnhancersDefault = compose) {
    const composeEnhancers =
      (typeof window !== 'undefined' && (window.REDUX_DEVTOOLS_EXTENSION_COMPOSE as typeof compose)) || composeEnhancersDefault;
    this.store = createStore((state = initState) => state, initState, composeEnhancers(applyMiddleware(...middlewares)));
    this.reducers = {};
  }

  getStore() {
    return this.store;
  }

  /**
   * Adds new reducers to the store
   *
   * @param newReducers the object of new reducers.
   */
  register(newReducers: Record<string, never>) {
    this.reducers = { ...this.reducers, ...newReducers };
    this.store.replaceReducer(combineReducers({ ...this.reducers }));
    return () => {
      this.reducers = Object.entries(this.reducers)
        .filter((reducer) => !Object.keys(newReducers).includes(reducer as unknown as any))
        .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
      this.store.replaceReducer(combineReducers({ ...this.reducers }));
    };
  }
}

export const reduxRegistry = new ReducerRegistry();

export default ReducerRegistry;
