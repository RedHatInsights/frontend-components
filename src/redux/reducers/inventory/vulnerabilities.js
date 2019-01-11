import { applyReducerHash } from '../../../Utilities/ReducerRegistry';
import { CVE_FETCH_LIST } from '../../action-types';

function pendingVulnerabilities(state) {
    return {
        ...state,
        cveList: {
            ...state.cveList,
            isLoading: true
        }
    };
}

function fulfilledVulnerabilities(state, { payload }) {
    return {
        ...state,
        cveList: {
            payload,
            isLoading: false
        }
    };
}

export const VulnerabilitiesStore = applyReducerHash(
    {
        [`${CVE_FETCH_LIST}_PENDING`]: pendingVulnerabilities,
        [`${CVE_FETCH_LIST}_FULFILLED`]: fulfilledVulnerabilities
    }, {
        cveList: { isLoading: true }
    }
);
