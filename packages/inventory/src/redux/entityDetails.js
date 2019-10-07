import { ACTION_TYPES, APPLICATION_SELECTED, TOGGLE_TAG_MODAL } from './action-types';
import { tagsLoading, tagsFulfilled, toggleTagModal } from './entities';
export const defaultState = { loaded: false };

function entityDetailPending(state) {
    return {
        ...state,
        loaded: false
    };
}

function entityDetailLoaded(state, { payload }) {
    return {
        ...state,
        loaded: true,
        entity: payload.results[0]
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
    [APPLICATION_SELECTED]: onApplicationSelected,
    [ACTION_TYPES.LOAD_TAGS_PENDING]: tagsLoading,
    [ACTION_TYPES.LOAD_TAGS_FULFILLED]: tagsFulfilled,
    [TOGGLE_TAG_MODAL]: toggleTagModal
};
