import { ACTION_TYPES, SELECT_ENTITY, CHANGE_SORT, FILTER_ENTITIES, SHOW_ENTITIES } from '../../action-types';
import { mergeArraysByKey } from '../../../Utilities/helpers';
import { SortDirection } from '../../../PresentationalComponents/Table';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export const defaultState = { loaded: false };

const defaultColumns = [
    { key: 'display_name', title: 'Name', composed: [ 'display_name', 'facts.inventory.hostname' ]},
    { key: 'updated', title: 'Last Seen', isTime: true }
];

function entitiesPending(state) {
    return {
        ...state,
        columns: mergeArraysByKey([ state.columns, defaultColumns ], 'key'),
        loaded: false
    };
}

function filterEntities(state, { payload: { key, filterString }}) {
    const entities = filterString ?
        state.rows.filter(item => item[key] && item[key].indexOf(filterString) !== -1) :
        [ ...state.rows ];
    return {
        ...state,
        entities
    };
}

function entitiesLoaded(state, { payload }) {
    const entities = mergeArraysByKey([ state.rows, payload.results ]);
    return {
        ...state,
        loaded: payload.hasOwnProperty('loaded') ? payload.loaded : true,
        rows: entities,
        entities,
        count: payload.count
    };
}

function selectEntity(state, { payload: { id, selected }}) {
    const ents = [ ...state.entities ];
    ents.find(entity => entity.id === id).selected = selected;
    return {
        ...state,
        entities: ents
    };
}

function changeSort(state, { payload: { key, direction }}) {
    const sortedRows = orderBy(
        state.entities,
        [ e => get(e, key) ],
        [ SortDirection.up === direction ? 'asc' : 'desc' ]
    );
    return {
        ...state,
        entities: sortedRows
    };
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [SHOW_ENTITIES]: (state, action) => entitiesLoaded(state, {
        payload: {
            ...action,
            loaded: false
        }
    }),
    [SELECT_ENTITY]: selectEntity,
    [CHANGE_SORT]: changeSort,
    [FILTER_ENTITIES]: filterEntities
};
