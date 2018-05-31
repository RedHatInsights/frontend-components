import { applyMiddleware, combineReducers, createStore, compose } from 'redux';
import MiddlewareListener from './MiddlewareListener';

export function applyReducerHash(reducerHash) {
    return function(state, action) {
        let newState = state;

        if (Object.prototype.hasOwnProperty.call(reducerHash, action.type)) {
            newState = reducerHash[action.type](state, action);
        }

        return newState;
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
        this.listenerMiddleware = new MiddlewareListener();
        this.store = createStore(
            (state = {}) => state,
            initState,
            composeEnhancers(applyMiddleware(...[this.listenerMiddleware.getMiddleware(), ...middlewares]))
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
     * adds the reducers to the store.
     *
     * @param reducers object where a key maps to a reducer
     */
    changeListener(reducers) {
        this.store.replaceReducer(combineReducers({...this.reducers, ...reducers}));
    }

    /**
     * calls the function to add the new reducers to the store.
     *
     * @param newReducers the object of new reducers.
     */
    register(newReducers) {
        this.reducers = {...this.reducers, ...newReducers};
        this.changeListener(this.reducers);
    }
}

export default ReducerRegistry;
