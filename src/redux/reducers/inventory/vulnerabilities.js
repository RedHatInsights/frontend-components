import { applyReducerHash } from '../../../Utilities/ReducerRegistry';
import { CVE_FETCH_LIST, SYSTEM_CVE_STATUS_LIST } from '../../action-types';

function pendingVulnerabilities(state, { meta }) {
    return {
        ...state,
        timestamp: meta,
        cveList: {
            ...state.cveList,
            isLoading: true
        }
    };
}

function rejectedVulnerabilities(state, { meta, payload }) {
    return {
        ...state,
        timestamp: meta,
        cveList: {
            payload: { errors: payload },
            isLoading: false
        }
    };
}

function fulfilledVulnerabilities(state, { payload, meta }) {
    if (meta >= state.timestamp) {
        return {
            ...state,
            timestamp: meta,
            cveList: {
                payload,
                isLoading: false
            }
        };
    }
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
        [`${CVE_FETCH_LIST}_REJECTED`]: rejectedVulnerabilities,
        [`${CVE_FETCH_LIST}_FULFILLED`]: fulfilledVulnerabilities,
        [`${SYSTEM_CVE_STATUS_LIST}_PENDING`]: pendingStatusList,
        [`${SYSTEM_CVE_STATUS_LIST}_FULFILLED`]: fulfilledStatusList
    },
    {
        cveList: { isLoading: true, meta: new Date() }
    }
);
