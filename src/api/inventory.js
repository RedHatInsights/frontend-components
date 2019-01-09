export const INVENTORY_API_BASE = '/r/insights/platform/inventory/api/v1/hosts';

/* eslint camelcase: off */
const mapData = ({ results = [], ...data }) => ({
    ...data,
    results: results.map(({ facts = {}, ...oneResult }) => ({
        ...oneResult,
        facts: facts.reduce((acc, curr) => ({
            ...acc,
            [curr.namespace]: curr.facts
        }), {})
    }))
});

function buildQuery({ per_page, page, filters }) {
    const allowedFilters = [ 'display_name' ];
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

export function getEntities(items, { base = INVENTORY_API_BASE, ...rest }) {
    let query = buildQuery(rest);

    return insights.chrome.auth.getUser().then(
        () => fetch(`${base}${items.length !== 0 ? '/' + items : ''}${query}`).then(r => {
            if (r.ok) {
                return r.json().then(mapData);
            }

            throw new Error(`Unexpected response code ${r.status}`);
        })
    );
}
