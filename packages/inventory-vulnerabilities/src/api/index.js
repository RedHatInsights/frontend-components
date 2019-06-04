import { DefaultApi } from '@redhat-cloud-services/vulnerabilities-client';
import instance from './interceptors';

const BASE_ROUTE = '/api/vulnerability/';

const api = new DefaultApi(undefined, BASE_ROUTE, instance);

/* eslint-disable camelcase */

export function getCveListBySystem(apiProps) {
    const { system } = apiProps;
    let parameterNames = [
        'filter',
        'limit',
        'offset',
        'page',
        'page_size',
        'sort',
        'cvss_from',
        'cvss_to',
        'public_from',
        'public_to',
        'severity',
        'status_id',
        'data_format'
    ];
    if (apiProps && system) {
        Object.keys(apiProps).forEach(key => (apiProps[key] === undefined || apiProps[key] === '') && delete apiProps[key]);
        const params = parameterNames.map(item => apiProps[item]);
        return api.getCveListBySystem(system, ...params);
    }
}

export async function fetchStatusList() {
    return api.getStatusList();
}

export function changeSystemCveStatus(inventory_id, cve, status_id, callback) {
    const body = { inventory_id, cve, status_id };
    return api.setStatus(body).then(() => callback());
}
