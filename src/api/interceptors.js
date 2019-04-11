import axios from 'axios';

export class HttpError extends Error {
    constructor(description) {
        super('Error communicating with the server');
        this.description = description;
    }
}

export async function authInterceptor(config) {
    await window.insights.chrome.auth.getUser();
    return config;
}

export function responseDataInterceptor(response) {
    if (response.data) {
        return response.data;
    }

    return response;
}

export function interceptor401(error) {
    if (error.response && error.response.status === 401) {
        window.insights.chrome.auth.logout();
        return false;
    }

    throw error;
}

export function errorInterceptor(err) {
    if (err.response && err.response.data && err.response.data.errors && err.response.data.errors.length) {
        const error = err.response.data.errors[0];

        if (error.details && error.details.name) {
            throw new HttpError(`${error.title} (${error.details.name})`);
        }

        throw new HttpError(error.title);
    }

    throw err;
}

const instance = axios.create();
instance.interceptors.request.use(authInterceptor);
instance.interceptors.response.use(responseDataInterceptor);
instance.interceptors.response.use(null, interceptor401);
instance.interceptors.response.use(null, errorInterceptor);

export default instance;
