import { FETCH_RESOLUTIONS } from '../action-types';

// Initial State
export const resolutionsInitialState = {
    isLoading: false,
    resolutions: undefined
};

const setLoadingState = (state) => ({ ...state, isLoading: true });

const setResolutions = (state, { payload }) => ({ ...state, ...payload, isLoading: false });

export default {
    [`${FETCH_RESOLUTIONS}_FULFILLED`]: setResolutions,
    [`${FETCH_RESOLUTIONS}_PENDING`]: setLoadingState
};
