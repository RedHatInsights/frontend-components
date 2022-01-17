import { ACTION_TYPES } from './action-types';
import { getEntitySystemProfile, hosts } from '../api';

export const systemProfile = (itemId) => ({
  type: ACTION_TYPES.LOAD_SYSTEM_PROFILE,
  payload: getEntitySystemProfile(itemId, {}),
});

export const editDisplayName = (id, value) => ({
  type: ACTION_TYPES.SET_DISPLAY_NAME,
  payload: hosts.apiHostPatchById([id], { display_name: value }), // eslint-disable-line camelcase
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Display name has been updated',
        dismissable: true,
      },
    },
  },
});

export const editAnsibleHost = (id, value) => ({
  type: ACTION_TYPES.SET_ANSIBLE_HOST,
  payload: hosts.apiHostPatchById([id], { ansible_host: value }), // eslint-disable-line camelcase
  meta: {
    notifications: {
      fulfilled: {
        variant: 'success',
        title: 'Ansible hostname has been updated',
        dismissable: true,
      },
    },
  },
});
