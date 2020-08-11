/* eslint-disable camelcase */
import { SYSTEM_ISSUE_TYPES } from './action-types';

export function advisor(state, { payload }) {
    return {
        ...state,
        systemIssues: {
            ...state?.systemIssues,
            advisor: {
                isLoaded: true,
                criticalCount: payload?.filter(item => item?.total_risk >= 4)
            }
        }
    };
}

export function cve(state, { payload }) {
    return {
        ...state,
        systemIssues: {
            ...state?.systemIssues,
            cve: {
                isLoaded: true,
                critical: {
                    count: payload?.critical?.meta?.total_items || 0
                },
                moderate: {
                    count: payload?.moderate?.meta?.total_items || 0
                },
                important: {
                    count: payload?.important?.meta?.total_items || 0
                },
                low: {
                    count: payload?.low?.meta?.total_items || 0
                }
            }
        }
    };
}

export function patch(state, { payload }) {
    return {
        ...state,
        systemIssues: {
            ...state?.systemIssues,
            patch: {
                isLoaded: true,
                bug: {
                    count: payload?.data?.attributes?.rhba_count || 0
                },
                enhancement: {
                    count: payload?.data?.attributes?.rhea_count || 0
                },
                security: {
                    count: payload?.data?.attributes?.rhsa_count || 0
                }
            }
        }
    };
}

export function compliance(state, { payload }) {
    return {
        ...state,
        systemIssues: {
            ...state?.systemIssues,
            compliance: {
                isLoaded: true,
                profiles: payload?.data?.system?.profiles
            }
        }
    };
}

export function isPending(state, type) {
    return {
        ...state,
        systemIssues: {
            ...state?.systemIssues,
            ...type && { [type]: { isLoaded: false } }
        }
    };
}

export default {
    [SYSTEM_ISSUE_TYPES.LOAD_ADVISOR_RECOMMENDATIONS_PENDING]: (state) => isPending(state, 'advisor'),
    [SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_CVES_PENDING]: (state) => isPending(state, 'cve'),
    [SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_ADVISORIES_PENDING]: (state) => isPending(state, 'patch'),
    [SYSTEM_ISSUE_TYPES.LOAD_COMPLIANCE_POLICIES_PENDING]: (state) => isPending(state, 'compliance'),
    [SYSTEM_ISSUE_TYPES.LOAD_ADVISOR_RECOMMENDATIONS_FULFILLED]: advisor,
    [SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_CVES_FULFILLED]: cve,
    [SYSTEM_ISSUE_TYPES.LOAD_APPLICABLE_ADVISORIES_FULFILLED]: patch,
    [SYSTEM_ISSUE_TYPES.LOAD_COMPLIANCE_POLICIES_FULFILLED]: compliance
};
