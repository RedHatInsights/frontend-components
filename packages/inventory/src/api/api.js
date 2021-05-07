import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import flatMap from 'lodash/flatMap';
export const INVENTORY_API_BASE = '/api/inventory/v1';

import instance from '@redhat-cloud-services/frontend-components-utilities/interceptors';
import { generateFilter, mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { HostsApi, TagsApi } from '@redhat-cloud-services/host-inventory-client';
import { defaultFilters } from '../shared/constants';

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

export const filtersReducer = (acc, filter = {}) => ({
    ...acc,
    ...filter.value === 'hostname_or_id' && { hostnameOrId: filter.filter },
    ...'tagFilters' in filter && { tagFilters: filter.tagFilters },
    ...'staleFilter' in filter && { staleFilter: filter.staleFilter },
    ...'registeredWithFilter' in filter && { registeredWithFilter: filter.registeredWithFilter }
});

export async function getEntities(items, {
    controller,
    hasItems,
    filters,
    per_page: perPage,
    page,
    orderBy,
    orderDirection,
    fields = { system_profile: [ 'operating_system' ] },
    ...options
}, showTags) {
    if (hasItems && items.length > 0) {
        let data = await hosts.apiHostGetHostById(items, undefined, perPage, page, undefined, undefined, { cancelToken: controller && controller.token });

        if (fields && Object.keys(fields).length) {
            try {
                const result = await hosts.apiHostGetHostSystemProfileById(
                    items,
                    perPage,
                    page,
                    orderBy,
                    undefined,
                    undefined,
                    undefined,
                    {
                        cancelToken: controller && controller.token,
                        query: generateFilter(fields, 'fields')
                    }
                );

                data = {
                    ...data,
                    results: mergeArraysByKey([
                        data?.results,
                        result?.results || []
                    ], 'id')
                };
            } catch (e) {
                console.error(e);
            }
        }

        data = showTags ? await mapTags(data) : data;

        data = {
            ...data,
            filters,
            results: data.results.map(result => mapData({
                ...result,
                display_name: result.display_name || result.fqdn || result.id
            }))
        };

        return data;
    } else if (!hasItems) {
        return hosts.apiHostGetHostList(
            undefined,
            undefined,
            filters.hostnameOrId,
            undefined,
            undefined,
            perPage,
            page,
            orderBy,
            orderDirection,
            filters.staleFilter,
            [
                ...constructTags(filters.tagFilters),
                ...options.tags || []
            ],
            filters.registeredWithFilter,
            undefined,
            undefined,
            {
                cancelToken: controller && controller.token,
                query: {
                    ...(options.filter && Object.keys(options.filter).length && generateFilter(options.filter)),
                    ...(fields && Object.keys(fields).length && generateFilter(fields, 'fields'))
                }
            }
        )
        .then((data) => showTags ? mapTags(data, { orderBy, orderDirection }) : data)
        .then(({ results = [], ...data } = {}) => ({
            ...data,
            filters,
            results: results.map(result => mapData({
                ...result,
                display_name: result.display_name || result.fqdn || result.id
            }))
        }));
    }

    return {
        page,
        per_page: perPage,
        results: []
    };
}

export const getEntitySystemProfile = (item) => hosts.apiHostGetHostSystemProfileById([ item ]);

export function getTags(systemId, search, { pagination } = { pagination: {} }) {
    return hosts.apiHostGetHostTags(
        systemId,
        pagination.perPage || 10,
        pagination.page || 1,
        undefined,
        undefined,
        search
    );
}

export function getAllTags(search, { filters, pagination, ...options } = { pagination: {} }) {
    const {
        tagFilters,
        staleFilter,
        registeredWithFilter
    } = filters ? filters.reduce(filtersReducer, defaultFilters) : defaultFilters;
    return tags.apiTagGetTags(
        [
            ...tagFilters ? constructTags(tagFilters) : [],
            ...options.tags || []
        ],
        'tag',
        'ASC',
        (pagination && pagination.perPage) || 10,
        (pagination && pagination.page) || 1,
        staleFilter,
        search,
        registeredWithFilter
    );
}
