import {applyMiddleware, combineReducers, createStore} from "redux";
import promiseMiddleware from "redux-promise-middleware";

/**
 * https://redux.js.org/basics/store
 * https://redux.js.org/api-reference/combinereducers
 * https://redux.js.org/api-reference/applymiddleware
 */
const store = createStore(combineReducers({}), applyMiddleware(promiseMiddleware()));

/**
 * Class used to added reducers to the store during runtime.
 *
 * http://nicolasgallagher.com/redux-modules-and-code-splitting/
 */
class ReducerRegistry {
    constructor() {
        this.reducers = {};
    }

    getStore() {
        return store;
    }

    /**
     * adds the reducers to the store.
     *
     * @param reducers object where a key maps to a reducer
     */
    changeListener(reducers) {
        store.replaceReducer(combineReducers({...this.reducers, ...reducers}));
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

/* only need one instance of reducer registry */
export default new ReducerRegistry();
