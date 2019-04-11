const BASE_ROUTE = '/api/vulnerability/';
const API_VERSION = 'v1';

/* eslint-disable camelcase */

export function getCveListBySystem({
    system,
    page = 1,
    page_size: pageSize,
    cvss_from: cvssFrom,
    cvss_to: cvssTo,
    public_from: publicFrom,
    public_to: publicTo,
    severity,
    filter,
    status_id: statusId,
    data_format: dataFormat,
    sort
}) {
    let query = [
        page && { page },
        pageSize && { page_size: pageSize },
        cvssFrom && { cvss_from: cvssFrom },
        publicFrom && { public_from: publicFrom },
        publicTo && { public_to: publicTo },
        severity && { severity },
        cvssTo && { cvss_to: cvssTo },
        filter && { filter },
        statusId && { status_id: statusId },
        dataFormat && { data_format: dataFormat },
        sort && { sort }
    ]
    .reduce((acc, curr) => [ ...acc, curr && `${Object.keys(curr)[0]}=${Object.values(curr)[0]}` ], [])
    .filter(Boolean)
    .join('&');
    if (system) {
        return fetch(`${BASE_ROUTE}${API_VERSION}/systems/${system}/cves?${query}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => {
            if (!res.ok) {
                throw res;
            }

            return res.json();
        })
        .catch(error => {
            return error.json().then(error => {
                throw { title: 'Vulnerability Error', ...error.errors[0] };
            });
        });
    }
}

export async function fetchStatusList() {
    return fetch(`${BASE_ROUTE}${API_VERSION}/status`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => {
        if (!res.ok) {
            throw res;
        }

        return res.json();
    })
    .catch(error => {
        return error.json().then(error => {
            throw { title: 'Vulnerability Error', ...error.errors[0] };
        });
    });
}

export function changeSystemCveStatus(inventory_id, cve, status_id, callback) {
    const body = { inventory_id, cve, status_id };
    return fetch(`${BASE_ROUTE}${API_VERSION}/status`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => {
        if (!res.ok) {
            throw res;
        }

        return callback();
    });
}
