import URI from 'urijs';

const API_BASE = '/r/insights/platform/remediations/v1';

function checkResponse (r) {
    if (!r.ok) {
        const error =  new Error(`Unexpected response code ${r.status}`);
        error.statusCode = r.status;
        throw error;
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

export function createRemediation (data, base = API_BASE) {
    const uri = new URI(API_BASE).segment('remediations').toString();
    return fetch(uri, {
        headers,
        method: 'POST',
        body: JSON.stringify(data)
    }).then(json);
}

export function patchRemediation (id, data, base = API_BASE) {
    const uri = new URI(API_BASE).segment('remediations').segment(id).toString();
    return fetch(uri, {
        headers,
        method: 'PATCH',
        body: JSON.stringify(data)
    }).then(checkResponse);
}

export function getRemediations (basePath = API_BASE) {
    const uri = new URI(API_BASE).segment('remediations').toString();
    return fetch(uri).then(json);
}

export function getRemediation (id, basePath = API_BASE) {
    const uri = new URI(API_BASE).segment('remediations').segment(id).toString();
    return fetch(uri).then(json);
}

export function getResolutionsBatch (issues, basePath = API_BASE) {
    const uri = new URI(API_BASE).segment('resolutions').toString();
    return fetch(uri, {
        headers,
        method: 'POST',
        body: JSON.stringify({ issues })
    }).then(json);
}
