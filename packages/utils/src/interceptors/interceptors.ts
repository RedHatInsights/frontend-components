import axios from 'axios';
import { captureException, configureScope } from '@sentry/browser';

export class HttpError extends Error {
  description: string;
  constructor(description: string) {
    super('Error communicating with the server');
    this.description = description;
  }
}

export async function authInterceptor(config: any) {
  // TODO: Provide commone types package with global declarations
  //@ts-ignore
  await window.insights.chrome.auth.getUser();
  return config;
}

export function responseDataInterceptor(response: any) {
  if (response.data) {
    return response.data;
  }

  return response;
}

export function interceptor401(error: any) {
  if (error.response && error.response.status === 401) {
    //@ts-ignore
    window.insights.chrome.auth.logout();
    return false;
  }

  throw error;
}

export function interceptor500(error: any) {
  if (error.response && error.response.status >= 500 && error.response.status < 600) {
    configureScope((scope) => {
      scope.setTag('request_id', error.response.req_id);
    });
  }

  throw error;
}

export function errorInterceptor(err: any) {
  if (!axios.isCancel(err)) {
    let requestId;
    try {
      const errObject = { ...err };
      requestId = errObject.response?.headers?.['x-rh-insights-request-id'];
      if (errObject.response && errObject.response.data) {
        throw { ...errObject.response.data, statusText: errObject.response.statusText };
      }

      throw err;
    } catch (customError: any) {
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
instance.interceptors.response.use(undefined, interceptor401);
instance.interceptors.response.use(undefined, interceptor500);
instance.interceptors.response.use(undefined, errorInterceptor);

export default instance;
