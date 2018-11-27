import { ACTION_TYPES, SELECT_ENTITY, CHANGE_SORT, FILTER_ENTITIES, APPLICATION_SELECTED, SHOW_ENTITIES } from '../action-types';
import { getEntity, getEntities } from '../../api/inventory';

export const loadEntities = (items = []) => ({
    type: ACTION_TYPES.LOAD_ENTITIES,
    payload: getEntities(items)
});

export const showEntities = (items = []) => ({
    type: SHOW_ENTITIES,
    payload: {
        results: items
    }
});

export const loadEntity = id => ({
    type: ACTION_TYPES.LOAD_ENTITY,
    payload: getEntity(id)
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
