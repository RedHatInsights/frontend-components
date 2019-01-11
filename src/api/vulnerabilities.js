const BASE_ROUTE = '/r/insights/platform/vulnerability/';
const API_VERSION = 'v1';

/* eslint-disable camelcase */

export function getCveListBySystem({
    system,
    page = 1,
    page_size: pageSize,
    cvss_from: cvssFrom,
    cvss_to: cvssTo,
    filter,
    data_format: dataFormat
}) {
    const query = [
        page && { page },
        pageSize && { page_size: pageSize },
        cvssFrom && { cvss_from: cvssFrom },
        cvssTo && { cvss_to: cvssTo },
        filter && { filter },
        dataFormat && { data_format: dataFormat }
    ].reduce((acc, curr) => ([ ...acc, curr && `${Object.keys(curr)[0]}=${Object.values(curr)[0]}` ]), [])
    .filter(Boolean)
    .join('&');
    return fetch(`${BASE_ROUTE}${API_VERSION}/systems/${system}/cves?${query}`, {
        method: 'GET'
    }).then(res => {
        if (!res.ok) {
            throw res;
        }

        return res.json();
    });
}
