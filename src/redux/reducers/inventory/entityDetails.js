import { ACTION_TYPES, APPLICATION_SELECTED } from '../../action-types';

export const defaultState = { loaded: false };

// Kudos to https://stackoverflow.com/a/18650828/2560321
const formatBytes = (bytes) => {
    if (bytes === 0 || !bytes) {
        return '0 B';
    }

    const sizes = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(2))} ${sizes[index]}`;
};

function entityDetailPending(state) {
    return {
        ...state,
        loaded: false
    };
}

function systemProfilePending(state) {
    return {
        ...state,
        systemProfile: {
            loaded: false
        }
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

function onSystemProfile(state, { payload: { results }}) {
    const systemProfile = (results && results[0] && results[0].system_profile) || {};
    return {
        ...state,
        systemProfile: {
            loaded: true,
            ...systemProfile,
            ramSize: formatBytes(systemProfile.system_memory_bytes),
            repositories: systemProfile.yum_repos && systemProfile.yum_repos.reduce((acc, curr) => ({
                ...acc,
                ...curr.enabled ? {
                    enabled: [ ...acc.enabled, curr ]
                } : {
                    disabled: [ ...acc.disabled, curr ]
                }
            }), { enabled: [], disabled: []}),
            network: systemProfile.network_interfaces && systemProfile.network_interfaces.reduce((acc, curr) => ({
                interfaces: [ ...acc.interfaces, curr ],
                ipv4: [ ...acc.ipv4, ...curr.ipv4_addresses || [] ].filter(Boolean),
                ipv6: [ ...acc.ipv6, ...curr.ipv6_addresses || [] ].filter(Boolean)
            }), { interfaces: [], ipv4: [], ipv6: []})
        }
    };
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: () => defaultState,
    [ACTION_TYPES.LOAD_ENTITY_PENDING]: entityDetailPending,
    [ACTION_TYPES.LOAD_ENTITY_FULFILLED]: entityDetailLoaded,
    [APPLICATION_SELECTED]: onApplicationSelected,
    [ACTION_TYPES.LOAD_SYSTEM_PROFILE_FULFILLED]: onSystemProfile,
    [ACTION_TYPES.LOAD_SYSTEM_PROFILE_PENDING]: systemProfilePending
};
