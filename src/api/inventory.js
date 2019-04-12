import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import flatMap from 'lodash/flatMap';
export const INVENTORY_API_BASE = '/api/inventory/v1';

import instance from './interceptors';
import { HostsApi } from '@redhat-cloud-services/host-inventory-client';

const hosts = new HostsApi(undefined, INVENTORY_API_BASE, instance);

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
            (acc, curr) => ({ ...acc, ...(typeof curr !== 'string') ? curr : {}}), {}
        )
    }
});

export function getEntities(items, { controller, hasItems, filters, per_page: perPage, page }) {
    const hostnameOrId = filters ? filters.find(filter => filter.value === 'hostname_or_id') : undefined;

    if (hasItems) {
        return hosts.apiHostGetHostById(items, perPage, page, { cancelToken: controller && controller.token })
        .then(({ results = [], ...data } = {}) => ({
            ...data,
            results: results.map(result => mapData({
                ...result,
                display_name: result.display_name || result.fqdn || result.id
            }))
        }));
    }

    return hosts.apiHostGetHostList(
        undefined,
        undefined,
        hostnameOrId && hostnameOrId.filter,
        undefined,
        perPage,
        page,
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
