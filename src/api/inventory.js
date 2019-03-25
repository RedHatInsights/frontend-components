import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import flatMap from 'lodash/flatMap';
export const INVENTORY_API_BASE = '/api/inventory/v1/hosts';

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

function buildQuery({ per_page, page, filters }) {
    const allowedFilters = [ 'hostname_or_id', 'fqdn' ];
    let query = [];
    const makeValue = (item, keyValue, keyFilter) => (
        allowedFilters.find(allowed => allowed === item[keyValue]) && `${item[keyValue]}=${item[keyFilter]}`
    );
    if (per_page || page) {
        const params = { per_page, page };
        query = [
            ...query,
            ...Object.keys(params).reduce(
                (acc, curr) => [ ...acc, `${curr}=${params[curr]}` ], []
            )
        ];
    }

    if (filters) {
        query = [
            ...query,
            ...Object.values(filters).reduce((acc, curr) => [
                ...acc,
                makeValue(curr, 'value', 'filter'),
                makeValue(curr, 'group', 'value')
            ], [])
        ].filter(Boolean);
    }

    return query ? `?${query.join('&')}` : '';
}

export function getEntities(items, { base = INVENTORY_API_BASE, controller, hasItems, ...rest }) {
    let query = buildQuery(rest);

    return insights.chrome.auth.getUser().then(
        () => {
            if (hasItems && items / length === 0) {
                return {};
            }

            return fetch(
                `${base}${items.length !== 0 ? '/' + items : ''}${query}`,
                {
                    credentials: 'include',
                    signal: controller && controller.signal
                }
            ).then(r => {
                if (r.ok) {
                    return r.json().then(({ results = [], ...data }) => ({
                        ...data,
                        results: results.map(result => mapData({
                            ...result,
                            display_name: result.display_name || result.fqdn || result.id
                        }))
                    }));
                }

                throw new Error(`Unexpected response code ${r.status}`);
            });
        }
    );
}
