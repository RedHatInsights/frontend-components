import { ACTION_TYPES, APPLICATION_SELECTED } from '../../action-types';
import { applyReducerHash } from '../../../Utilities/ReducerRegistry';

export const defaultState = { loaded: false };

function entityDetailPending(state, payload) {
    return {
        ...state,
        loaded: false
    };
}

function entityDetailLoaded(state, { payload }) {
    return {
        ...state,
        loaded: true,
        entity: payload
    };
}

function onApplicationSelected(state, { payload }) {
    return {
        ...state,
        activeApp: payload
    };
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: () => defaultState,
    [ACTION_TYPES.LOAD_ENTITY_PENDING]: entityDetailPending,
    [ACTION_TYPES.LOAD_ENTITY_FULFILLED]: entityDetailLoaded,
    [APPLICATION_SELECTED]: onApplicationSelected
};
