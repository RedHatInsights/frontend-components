import {
    ACTION_TYPES,
    SELECT_ENTITY,
    CHANGE_SORT,
    SHOW_ENTITIES,
    FILTER_SELECT,
    UPDATE_ENTITIES
} from '../../action-types';
import { mergeArraysByKey } from '../../../Utilities/helpers';
import { SortDirection } from '../../../PresentationalComponents/Table';
import flatMap from 'lodash/flatMap';

export const defaultState = { loaded: false };

const defaultColumns = [
    { key: 'display_name', title: 'Name', composed: [ 'facts.os_release', 'display_name' ]},
    { key: 'updated', title: 'Last Checked', isTime: true }
];

export const mapData = ({ facts = {}, ...oneResult }) => ({
    ...oneResult,
    rawFacts: facts,
    facts: flatMap(facts, (oneFact => Object.values(oneFact)))
    .map(item => typeof item !== 'string' ? ({
        ...item,
        // eslint-disable-next-line camelcase
        os_release: item.os_release || item.release,
        // eslint-disable-next-line camelcase
        display_name: item.display_name || item.fqdn || item.id
    }) : item)
    .reduce(
        (acc, curr) => ({ ...acc, ...(typeof curr !== 'string') ? curr : {}}), {}
    )
});

function entitiesPending(state) {
    return {
        ...state,
        columns: mergeArraysByKey([ state.columns, defaultColumns ], 'key'),
        rows: [],
        activeFilters: [],
        loaded: false
    };
}

// eslint-disable-next-line camelcase
function entitiesLoaded(state, { payload: { results, per_page: perPage, page, count, total, loaded }}) {
    return {
        ...state,
        loaded: loaded === undefined || loaded,
        rows: mergeArraysByKey([ state.rows, results ]).map(mapData),
        perPage: perPage !== undefined ? perPage : state.perPage,
        page: page !== undefined ? page : state.page,
        count: count !== undefined ? count : state.count,
        total: total !== undefined ? total : state.total
    };
}

function selectEntity(state, { payload: { id, selected }}) {
    const rows = [ ...state.rows ];
    const entity = rows.find(entity => entity.id === id);
    if (entity) {
        entity.selected = selected;
    } else {
        rows.forEach(item => item.selected = selected);
    }

    return {
        ...state,
        rows
    };
}

function changeSort(state, { payload: { key, direction }}) {
    const sortBy = {
        key,
        direction: SortDirection.up === direction ? 'asc' : 'desc'
    };
    return {
        ...state,
        sortBy
    };
}

function selectFilter(state, { payload: { item: { items, ...item }, selected }}) {
    let { activeFilters = []} = state;
    if (selected) {
        activeFilters = [
            ...activeFilters,
            item,
            ...items ? items : []
        ];
        const values = activeFilters.map(active => active.value);
        activeFilters = activeFilters.filter((filter, key) => values.lastIndexOf(filter.value) === key);
    } else {
        activeFilters.splice(activeFilters.map(active => active.value).indexOf(item.value), 1);
        if (items) {
            items.forEach(subItem => {
                activeFilters.splice(activeFilters.map(active => active.value).indexOf(subItem.value), 1);
            });
        }
    }

    return {
        ...state,
        activeFilters
    };
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [UPDATE_ENTITIES]: entitiesLoaded,
    [SHOW_ENTITIES]: (state, action) => entitiesLoaded(state, {
        payload: {
            ...action.payload,
            loaded: false
        }
    }),
    [FILTER_SELECT]: selectFilter,
    [SELECT_ENTITY]: selectEntity,
    [CHANGE_SORT]: changeSort
};
