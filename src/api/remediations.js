const API_BASE = '/r/insights/platform/remediations/v1/remediations';

function checkResponse (r) {
    if (!r.ok) {
        throw new Error(`Unexpected response code ${r.status}`);
    }

    return r;
}

function json (r) {
    checkResponse(r);
    return r.json();
}

const headers = Object.freeze({
    'Content-Type': 'application/json; charset=utf-8'
});

export function createRemediation (data, basePath = API_BASE) {
    return fetch(basePath, {
        headers,
        method: 'POST',
        body: JSON.stringify(data)
    }).then(json);
}

export function patchRemediation (id, data, basePath = API_BASE) {
    return fetch(`${basePath}/${id}`, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(data)
    }).then(checkResponse);
}

export function getRemediations (basePath = API_BASE) {
    return fetch(basePath).then(json);
}
