import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import flatMap from 'lodash/flatMap';
export const INVENTORY_API_BASE = '/api/inventory/v1';

import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import { HostsApi, TagsApi } from '@redhat-cloud-services/host-inventory-client';

export const hosts = new HostsApi(undefined, INVENTORY_API_BASE, instance);
export const tags = new TagsApi(undefined, INVENTORY_API_BASE, instance);

/* eslint camelcase: off */
export const mapData = ({ facts = {}, ...oneResult }) => ({
    ...oneResult,
    rawFacts: facts,
    facts: {
        ...facts.reduce((acc, curr) => ({ ...acc, [curr.namespace]: curr.facts }), {}),
        ...flatMap(facts, (oneFact => Object.values(oneFact)))
        .map(item => typeof item !== 'string' ? ({
            ...item,
            // eslint-disable-next-line camelcase
            os_release: item.os_release || item.release,
            // eslint-disable-next-line camelcase
            display_name: item.display_name || item.fqdn || item.id
        }) : item)
        .reduce(
            (acc, curr) => ({ ...acc, ...(typeof curr !== 'string') ? curr : {} }), {}
        )
    }
});

export const mapTags = (data = { results: [] }, { orderBy, orderDirection } = {}) => {
    if (data.results.length > 0) {
        return hosts.apiHostGetHostTags(data.results.map(({ id }) => id), data.per_page, 1, orderBy, orderDirection)
        .then(({ results: tags }) => ({
            ...data,
            results: data.results.map(row => ({ ...row, tags: tags[row.id] || [] }))
        }))
        .catch(() => ({
            ...data,
            results: data.results.map(row => ({
                ...row,
                tags: []
            }))
        }));
    }

    return data;
};

export const constructTags = (tagFilters) => {
    return flatMap(
        tagFilters,
        ({ values, category: namespace }) => values.map(({ value: tagValue, tagKey }) => (
            `${namespace ? `${namespace}/` : ''}${tagKey}${tagValue ? `=${tagValue}` : ''}`
        ))
    ) || '';
};

export const filtersReducer = (acc, filter) => ({
    ...acc,
    ...filter.value === 'hostname_or_id' && { hostnameOrId: filter.filter },
    ...'tagFilters' in filter && { tagFilters: filter.tagFilters }
});

export function getEntities(items, {
    controller,
    hasItems,
    filters,
    per_page: perPage,
    page,
    orderBy = 'updated',
    orderDirection = 'DESC'
}) {
    const { hostnameOrId, tagFilters } = filters ? filters.reduce(filtersReducer, {}) : {};
    if (hasItems && items.length > 0) {
        return hosts.apiHostGetHostById(items, undefined, perPage, page, undefined, undefined, { cancelToken: controller && controller.token })
        .then(mapTags)
        .then(({ results = [], ...data } = {}) => ({
            ...data,
            filters,
            results: results.map(result => mapData({
                ...result,
                display_name: result.display_name || result.fqdn || result.id
            }))
        }));
    } else if (!hasItems) {
        return hosts.apiHostGetHostList(
            undefined,
            undefined,
            hostnameOrId,
            undefined,
            undefined,
            perPage,
            page,
            orderBy,
            orderDirection,
            '', //staleness
            constructTags(tagFilters),
            { cancelToken: controller && controller.token }
        )
        .then((data) => mapTags(data, { orderBy, orderDirection }))
        .then(({ results = [], ...data } = {}) => ({
            ...data,
            filters,
            results: results.map(result => mapData({
                ...result,
                display_name: result.display_name || result.fqdn || result.id
            }))
        }));
    }

    return new Promise((res) => {
        res({
            page,
            per_page: perPage,
            results: []
        });
    });
}

export const getEntitySystemProfile = (item) => hosts.apiHostGetHostSystemProfileById([ item ]);

export function getTags(systemId) {
    return hosts.apiHostGetHostTags(systemId).then(({ results }) => ({ results: Object.values(results)[0] }));
}

export function getAllTags(search, { filters } = {}) {
    const { tagFilters } = filters ? filters.reduce(filtersReducer, {}) : {};
    return tags.apiTagGetTags(
        tagFilters ? constructTags(tagFilters) : undefined,
        undefined,
        undefined,
        10,
        undefined,
        undefined,
        search
    );
}
