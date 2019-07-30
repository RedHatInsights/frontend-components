import { DefaultApi, GitApi } from '@redhat-cloud-services/vulnerabilities-client';
import instance from './interceptors';

const BASE_ROUTE = '/api/vulnerability/';

let api;
if (process.env.NODE_ENV === 'production') {
    api = new DefaultApi(undefined, BASE_ROUTE, instance);
} else {
    api = new GitApi(undefined, BASE_ROUTE, instance);
}
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
        'impact',
        'status_id',
        'data_format'
    ];
    if (apiProps && system) {
        Object.keys(apiProps).forEach(key => (apiProps[key] === undefined || apiProps[key] === '') && delete apiProps[key]);
        const params = parameterNames.map(item => apiProps[item]);
        return api.getCveListBySystem(system, ...params).catch(err => {
            if (err && err.status === '404') {
                return { errors: err };
            }

            throw err;
        });
    }
}

export async function fetchStatusList() {
    return api.getStatusList();
}

export function changeSystemCveStatus(inventory_id, cve, status_id, callback) {
    const body = { inventory_id, cve, status_id };
    return api.setStatus(body).then(() => callback());
}
