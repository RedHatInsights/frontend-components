import React from 'react';
import {
    ACTION_TYPES,
    SELECT_ENTITY,
    CHANGE_SORT,
    SHOW_ENTITIES,
    FILTER_SELECT,
    UPDATE_ENTITIES,
    ENTITIES_LOADING,
    CLEAR_FILTERS,
    TOGGLE_TAG_MODAL,
    TAGS_SELECTED
} from './action-types';
import { mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import TagWithDialog from '../TagWithDialog';
import groupBy from 'lodash/groupBy';

export const defaultState = { loaded: false, tagsLoaded: false, allTagsLoaded: false };

const defaultColumns = [
    { key: 'display_name', title: 'Name', composed: [ 'facts.os_release', 'display_name' ] },
    {
        key: 'tags',
        title: 'Tags',
        props: { width: 25, isStatic: true },
        // eslint-disable-next-line react/display-name
        renderFunc: (value, systemId) => <TagWithDialog count={value.length} systemId={systemId} />
    },
    { key: 'updated', title: 'Last sync', isTime: true, props: { width: 25 } }
];

function entitiesPending(state) {
    return {
        ...state,
        columns: mergeArraysByKey([ defaultColumns, state.columns ], 'key'),
        rows: [],
        loaded: false
    };
}

function clearFilters(state) {
    return {
        ...state,
        activeFilters: []
    };
}

// eslint-disable-next-line camelcase
function entitiesLoaded(state, { payload: { results, per_page: perPage, page, count, total, loaded, filters } }) {
    // Data are loaded and APi returned malicious data
    if (loaded === undefined && (page === undefined || perPage === undefined)) {
        return state;
    }

    return {
        ...state,
        activeFilters: filters || [],
        loaded: loaded === undefined || loaded,
        rows: mergeArraysByKey([ state.rows, results ]),
        perPage: perPage !== undefined ? perPage : state.perPage,
        page: page !== undefined ? page : state.page,
        count: count !== undefined ? count : state.count,
        total: total !== undefined ? total : state.total
    };
}

function selectEntity(state, { payload: { id, selected } }) {
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

function changeSort(state, { payload: { key, direction } }) {
    return {
        ...state,
        sortBy: {
            key,
            direction
        }
    };
}

function selectFilter(state, { payload: { item: { items, ...item }, selected } }) {
    let { activeFilters = [] } = state;
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

export function showTags(state, { payload }) {
    const activeSystemTag = state.rows ? state.rows.find(({ id }) => payload === id) : state.entity;
    return {
        ...state,
        activeSystemTag,
        tagsLoaded: true,
        showTagDialog: true
    };
}

export function toggleTagModal(state, { payload: { isOpen } }) {
    return {
        ...state,
        showTagDialog: isOpen
    };
}

export function allTags(state, { payload: { results } }) {
    // TODO: Remove me! I am just for testing purposes
    const fakeResults = results.length > 0 ? results : [{
        namespace: 'one',
        key: 'some',
        value: 'anothefr'
    }];

    return {
        ...state,
        allTags: Object.entries(groupBy(fakeResults, ({ namespace }) => namespace)).map(([ key, value ]) => ({
            name: key,
            tags: value
        })),
        allTagsLoaded: true
    };
}

export default {
    [ACTION_TYPES.ALL_TAGS_FULFILLED]: allTags,
    [ACTION_TYPES.ALL_TAGS_PENDING]: (state) => ({ ...state, allTagsLoaded: false }),
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [ACTION_TYPES.LOAD_TAGS]: showTags,
    [UPDATE_ENTITIES]: entitiesLoaded,
    [SHOW_ENTITIES]: (state, action) => entitiesLoaded(state, {
        payload: {
            ...action.payload,
            loaded: false
        }
    }),
    [FILTER_SELECT]: selectFilter,
    [SELECT_ENTITY]: selectEntity,
    [CHANGE_SORT]: changeSort,
    [CLEAR_FILTERS]: clearFilters,
    [ENTITIES_LOADING]: (state, { payload: { isLoading } }) => ({ ...state, loaded: !isLoading }),
    [TOGGLE_TAG_MODAL]: toggleTagModal
};
