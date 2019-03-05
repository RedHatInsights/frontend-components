import { applyReducerHash } from '../../../Utilities/ReducerRegistry';
import { CVE_FETCH_LIST, SYSTEM_CVE_STATUS_LIST } from '../../action-types';

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
            isLoading: true
        }
    };
}

function pendingStatusList(state) {
    return {
        ...state,
        statusList: {
            ...state.statusList,
            isLoading: true
        }
    };
}

function fulfilledStatusList(state, { payload }) {
    return {
        ...state,
        statusList: {
            payload,
            isLoading: false
        }
    };
}

export const VulnerabilitiesStore = applyReducerHash(
    {
        [`${CVE_FETCH_LIST}_PENDING`]: pendingVulnerabilities,
        [`${CVE_FETCH_LIST}_FULFILLED`]: fulfilledVulnerabilities,
        [`${SYSTEM_CVE_STATUS_LIST}_PENDING`]: pendingStatusList,
        [`${SYSTEM_CVE_STATUS_LIST}_FULFILLED`]: fulfilledStatusList
    },
    {
        cveList: { isLoading: true }
    }
);
