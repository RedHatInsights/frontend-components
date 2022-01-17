import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { ACTION_TYPES } from './action-types';

export const defaultState = { loaded: false };

export const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

// Kudos to https://stackoverflow.com/a/18650828/2560321
export const formatBytes = (bytes) => {
  if (bytes === 0 || isNaN(Number(bytes))) {
    return '0 B';
  }

  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, index)).toFixed(2))} ${sizes[index]}`;
};

export function systemProfilePending(state) {
  return {
    ...state,
    systemProfile: {
      loaded: false,
    },
  };
}

export function calculateRepos(repos) {
  return (
    repos &&
    repos.reduce(
      (acc, curr) => ({
        ...acc,
        ...(curr.enabled
          ? {
              enabled: [...acc.enabled, curr],
            }
          : {
              disabled: [...acc.disabled, curr],
            }),
      }),
      { enabled: [], disabled: [] }
    )
  );
}

export function calculateInterfaces(interfaces) {
  return (
    interfaces &&
    interfaces.reduce(
      (acc, curr) => ({
        interfaces: [...acc.interfaces, curr],
        ipv4: [...acc.ipv4, ...(curr.ipv4_addresses || [])].filter(Boolean),
        ipv6: [...acc.ipv6, ...(curr.ipv6_addresses || [])].filter(Boolean),
      }),
      { interfaces: [], ipv4: [], ipv6: [] }
    )
  );
}

export function onSystemProfile(state, { payload: { results } }) {
  const systemProfile = (results && results[0] && results[0].system_profile) || {};
  return {
    ...state,
    systemProfile: {
      loaded: true,
      ...systemProfile,
      ramSize: systemProfile.system_memory_bytes && formatBytes(systemProfile.system_memory_bytes),
      repositories: calculateRepos(systemProfile.yum_repos),
      network: calculateInterfaces(systemProfile.network_interfaces),
    },
  };
}

export default applyReducerHash(
  {
    [ACTION_TYPES.LOAD_SYSTEM_PROFILE_FULFILLED]: onSystemProfile,
    [ACTION_TYPES.LOAD_SYSTEM_PROFILE_PENDING]: systemProfilePending,
  },
  {
    systemProfile: defaultState,
  }
);
