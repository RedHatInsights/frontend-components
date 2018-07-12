import { applyMiddleware, combineReducers, createStore, compose } from 'redux';

export function applyReducerHash(reducerHash, initialState = {}) {
    return function(state = initialState, action) {
        if (Object.prototype.hasOwnProperty.call(reducerHash, action.type)) {
            return reducerHash[action.type](state, action);
        }

        return state;
    }
}

export function dispatchActionsToStore(actions, store) {
    return Object.keys(actions).reduce((acc, curr) => ({
        ...acc,
        [curr]: (...passTrough) => store && store.dispatch(actions[curr](...passTrough)),
    }), {})
}

/**
 * Class used to added reducers to the store during runtime.
 *
 * http://nicolasgallagher.com/redux-modules-and-code-splitting/
 */
class ReducerRegistry {
    constructor(initState = {}, middlewares = [], composeEnhancers = compose) {
        this.store = createStore(
            (state = initState) => state,
            initState,
            composeEnhancers(applyMiddleware(...middlewares))
        );
        this.reducers = {};
    }

    on(event, callback) {
        this.listenerMiddleware.addNew({ on: event, callback });
    }

    getListenerMiddleware() {
        return this.listenerMiddleware;
    }

    getStore() {
        return this.store;
    }

    /**
     * Adds new reducers to the store
     *
     * @param newReducers the object of new reducers.
     */
    register(newReducers) {
        this.reducers = {...this.reducers, ...newReducers};
        this.store.replaceReducer(combineReducers({...this.reducers}));
    }
}

export const reduxRegistery = new ReducerRegistry();

export default ReducerRegistry;
