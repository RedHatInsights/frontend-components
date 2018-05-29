import 'cross-fetch/polyfill';
import { getAsyncSystems } from '../../demoData/systems';
import ReducerRegistry from '../../Utils/ReducerRegistry';

/**
 * Get Systems action and reducer.
 * getSystems is an action creator that dispatches and action.
 * Look at redux-promise-middleware to see how to introduce async calls
 * as the payload of an action.
 *
 * https://redux.js.org/basics/actions
 * https://redux.js.org/basics/reducers
 * https://redux.js.org/advanced/async-actions
 */
export const GET_SYSTEMS = 'GET_SYSTEMS';
export const getSystems = () => ({
    type: GET_SYSTEMS,
    payload: getAsyncSystems()
});

/**
 * Reducers handle a section of the state.
 *
 * @param state The part of the state that this reducer handles
 * @param action An action that the reducer could take care of.
 *               All actions get passed through each reducer.
 * @returns The piece of the state that the reducer mutates
 */
const getSystemsReducer = (state = [], action) => {
    switch(action.type) {
        case `${GET_SYSTEMS}_FULFILLED`:
            return action.payload.resources;
        case `${GET_SYSTEMS}_REJECTED`:
            return null;
        default:
            return state;
    }
};

/**
 * Adds Reducers to the redux store during runtime.
 * This is needed because of webpack code splitting.
 *
 *
 */
ReducerRegistry.register({systems: getSystemsReducer});
