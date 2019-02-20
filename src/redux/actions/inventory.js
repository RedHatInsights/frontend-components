import {
    ACTION_TYPES,
    SELECT_ENTITY,
    CHANGE_SORT,
    FILTER_ENTITIES,
    APPLICATION_SELECTED,
    SHOW_ENTITIES,
    FILTER_SELECT,
    UPDATE_ENTITIES,
    ENTITIES_LOADING
} from '../action-types';
import { getEntities } from '../../api/inventory';

export const loadEntities = (items = [], config) => ({
    type: ACTION_TYPES.LOAD_ENTITIES,
    payload: getEntities(items, config).then(results => ({
        ...results,
        page: config.itemsPage || results.page
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
