import { ACTION_TYPES, SELECT_ENTITY, CHANGE_SORT, FILTER_ENTITIES, APPLICATION_SELECTED } from '../action-types';
import { getEntity, getEntities } from '../../api/inventory';

export const loadEntities = () => ({
    type: ACTION_TYPES.LOAD_ENTITIES,
    payload: getEntities()
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
