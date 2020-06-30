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
    CLEAR_FILTERS,
    TOGGLE_TAG_MODAL
} from './action-types';
import { getEntities, getEntitySystemProfile, hosts, getAllTags, getTags } from '../api';

export const loadEntities = (items = [], config, { showTags } = {}) => ({
    type: ACTION_TYPES.LOAD_ENTITIES,
    payload: getEntities(items, config, showTags).then(results => ({
        ...results,
        page: config.itemsPage || (results && results.page)
    })),
    meta: {
        showTags
    }
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

export const loadEntity = (id, config, { showTags }) => ({
    type: ACTION_TYPES.LOAD_ENTITY,
    payload: getEntities(id, config, showTags),
    meta: {
        showTags
    }
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
                title: 'Display name has been updated',
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
                title: 'Ansible host name has been updated',
                dismissable: true
            }
        }
    }
});

export const loadTags = (systemId, search, options, count) => ({
    type: ACTION_TYPES.LOAD_TAGS,
    payload: getTags(systemId, search, options),
    meta: {
        tagsCount: count,
        systemId
    }
});

export const toggleTagModal = (isOpen) => ({
    type: TOGGLE_TAG_MODAL,
    payload: {
        isOpen: isOpen
    }
});

export const fetchAllTags = (search, options) => ({
    type: ACTION_TYPES.ALL_TAGS,
    payload: getAllTags(search, options)
});

export const deleteEntity = (systems, displayName) => ({
    type: ACTION_TYPES.REMOVE_ENTITY,
    payload: hosts.apiHostDeleteById(systems),
    meta: {
        notifications: {
            fulfilled: {
                variant: 'success',
                title: 'Delete operation finished',
                description: `${displayName} has been successfully removed.`,
                dismissable: true
            }
        },
        systems
    }
});
