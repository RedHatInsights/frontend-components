import { FETCH_SELECTED_HOSTS } from '../action-types';

// Initial State
export const hostsInitialState = {
    isLoading: false,
    hosts: []
};

const setLoadingState = (state) => ({ ...state, isLoading: true });

const setHosts = (state, { payload }) => ({ ...state, hosts: [ ...state.hosts, ...payload.results ], isLoading: false });

export default {
    [`${FETCH_SELECTED_HOSTS}_FULFILLED`]: setHosts,
    [`${FETCH_SELECTED_HOSTS}_PENDING`]: setLoadingState
};
