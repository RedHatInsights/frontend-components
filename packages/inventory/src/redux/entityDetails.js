import { ACTION_TYPES, APPLICATION_SELECTED, TOGGLE_TAG_MODAL, TOGGLE_DRAWER } from './action-types';
import { showTags, toggleTagModal } from './entities';
import systemIssuesReducer from './systemIssues';
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

function toggleDrawer(state, { payload }) {
    return  {
        ...state,
        isToggleOpened: payload?.isOpened
    };
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: () => defaultState,
    [ACTION_TYPES.LOAD_ENTITY_PENDING]: entityDetailPending,
    [ACTION_TYPES.LOAD_ENTITY_FULFILLED]: entityDetailLoaded,
    [APPLICATION_SELECTED]: onApplicationSelected,
    [ACTION_TYPES.LOAD_TAGS]: showTags,
    [TOGGLE_TAG_MODAL]: toggleTagModal,
    [TOGGLE_DRAWER]: toggleDrawer,
    ...systemIssuesReducer
};
