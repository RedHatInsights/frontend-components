const API_BASE = '/r/insights/platform/remediations/v1/remediations';

function json (r) {
    if (r.ok) {
        return r.json();
    }

    throw new Error(`Unexpected response code ${r.status}`);
}

export function createRemediation (data, basePath = API_BASE) {
    return fetch(basePath, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        method: 'POST',
        body: JSON.stringify(data)
    }).then(json);
}
