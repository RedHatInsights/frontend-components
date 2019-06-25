import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import flatMap from 'lodash/flatMap';
export const INVENTORY_API_BASE = '/api/inventory/v1';

import instance from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import { HostsApi } from '@redhat-cloud-services/host-inventory-client';

export const hosts = new HostsApi(undefined, INVENTORY_API_BASE, instance);

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

export function getEntities(items, {
    controller,
    hasItems,
    filters,
    per_page: perPage,
    page,
    orderBy = 'updated',
    orderDirection = 'DESC'
}) {
    const hostnameOrId = filters ? filters.find(filter => filter.value === 'hostname_or_id') : undefined;

    if (hasItems && items.length > 0) {
        return hosts.apiHostGetHostById(items, undefined, perPage, page, undefined, undefined, { cancelToken: controller && controller.token })
            .then(({ results = [], ...data } = {}) => ({
                ...data,
                results: results.map(result => mapData({
                    ...result,
                    display_name: result.display_name || result.fqdn || result.id
                }))
            }));
    } else if (!hasItems) {
        return hosts.apiHostGetHostList(
            undefined,
            undefined,
            hostnameOrId && hostnameOrId.filter,
            undefined,
            undefined,
            perPage,
            page,
            orderBy,
            orderDirection,
            { cancelToken: controller && controller.token }
        )
            .then(({ results = [], ...data } = {}) => ({
                ...data,
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

export const getEntitySystemProfile = (item) => hosts.apiHostGetHostSystemProfileById([item]);

