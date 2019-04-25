import {
    ACTION_TYPES,
    SELECT_ENTITY,
    CHANGE_SORT,
    FILTER_ENTITIES,
    APPLICATION_SELECTED,
    SHOW_ENTITIES,
    FILTER_SELECT,
    UPDATE_ENTITIES,
    ENTITIES_LOADING,
    CLEAR_FILTERS
} from '../action-types';
import { getEntities, getEntitySystemProfile, hosts } from '../../api/inventory';

export const loadEntities = (items = [], config) => ({
    type: ACTION_TYPES.LOAD_ENTITIES,
    payload: getEntities(items, config).then(results => ({
        ...results,
        page: config.itemsPage || (results && results.page)
    }))
});

export const showEntities = (items = []) => ({
    type: SHOW_ENTITIES,
    payload: {
        results: items
    }
});

export const updateEntities = (items = []) => ({
    type: UPDATE_ENTITIES,
    payload: {
        results: items
    }
});

export const filterSelect = (selectedItem) => ({
    type: FILTER_SELECT,
    payload: selectedItem
});

export const loadEntity = (id, config) => ({
    type: ACTION_TYPES.LOAD_ENTITY,
    payload: getEntities(id, config)
});

export const selectEntity = (id, selected) => ({
    type: SELECT_ENTITY,
    payload: { id, selected }
});

export const setSort = (key, direction) => ({
    type: CHANGE_SORT,
    payload: { key, direction }
});

export const filterEntities = (key, filterString) => ({
    type: FILTER_ENTITIES,
    payload: { key, filterString }
});

export const detailSelect = (appName) => ({
    type: APPLICATION_SELECTED,
    payload: { appName }
});

export const entitiesLoading = (isLoading = true) => ({
    type: ENTITIES_LOADING,
    payload: { isLoading }
});

export const clearFilters = () => ({
    type: CLEAR_FILTERS
});

export const systemProfile = (itemId) => ({
    type: ACTION_TYPES.LOAD_SYSTEM_PROFILE,
    payload: getEntitySystemProfile(itemId, {})
});

export const editDisplayName = (id, value) => ({
    type: ACTION_TYPES.SET_DISPLAY_NAME,
    payload: hosts.apiHostPatchHost(id, { display_name: value }), // eslint-disable-line camelcase
    meta: {
        notifications: {
            fulfilled: {
                variant: 'success',
                title: `Display name for entity with ID ${id} has been changed to ${value}`,
                dismissable: true
            }
        }
    }
});

export const editAnsibleHost = (id, value) => ({
    type: ACTION_TYPES.SET_ANSIBLE_HOST,
    payload: hosts.apiHostPatchHost(id, { ansible_host: value }), // eslint-disable-line camelcase
    meta: {
        notifications: {
            fulfilled: {
                variant: 'success',
                title: `Ansible host for entity with ID ${id} has been changed to ${value}`,
                dismissable: true
            }
        }
    }
});
