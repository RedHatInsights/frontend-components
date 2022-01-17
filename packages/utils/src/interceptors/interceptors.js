import axios from 'axios';
import { configureScope, captureException } from '@sentry/browser';

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

export function interceptor500(error) {
  if (error.response && error.response.status >= 500 && error.response.status < 600) {
    configureScope((scope) => {
      scope.setTag('request_id', error.response.req_id);
    });
  }

  throw error;
}

export function errorInterceptor(err) {
  if (!axios.isCancel(err)) {
    let requestId;
    try {
      const errObject = { ...err };
      requestId = errObject.response?.headers?.['x-rh-insights-request-id'];
      if (errObject.response && errObject.response.data) {
        throw { ...errObject.response.data, statusText: errObject.response.statusText };
      }

      throw err;
    } catch (customError) {
      if (!requestId) {
        customError.sentryId = captureException(customError);
      }

      customError.requestId = requestId;
      throw customError;
    }
  }
}

export const instance = axios.create();
instance.interceptors.request.use(authInterceptor);
instance.interceptors.response.use(responseDataInterceptor);
instance.interceptors.response.use(null, interceptor401);
instance.interceptors.response.use(null, interceptor500);
instance.interceptors.response.use(null, errorInterceptor);

export default instance;
