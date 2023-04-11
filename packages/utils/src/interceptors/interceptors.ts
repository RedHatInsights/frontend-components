/* eslint-disable rulesdir/no-chrome-api-call-from-window */
import { useMemo } from 'react';
import axios from 'axios';
import { captureException, configureScope } from '@sentry/browser';
//@ts-ignore
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

export class HttpError extends Error {
  description: string;
  constructor(description: string) {
    super('Error communicating with the server');
    this.description = description;
  }
}

export function authInterceptorWithChrome(chrome: any) {
  return async function (config: any) {
    // TODO: Provide common types package with global declarations
    //@ts-ignore
    await (chrome || window.insights.chrome).auth.getUser();
    return config;
  };
}

//@ts-ignore
export const authInterceptor = authInterceptorWithChrome();

export function responseDataInterceptor(response: any) {
  if (response.data) {
    return response.data;
  }

  return response;
}

export function interceptor401WithChrome(chrome: any) {
  return function (error: any) {
    if (error.response && error.response.status === 401) {
      //@ts-ignore
      (chrome || window.insights.chrome).auth.logout();
      return false;
    }

    throw error;
  };
}

//@ts-ignore
export const interceptor401 = interceptor401WithChrome();

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

export const useAxiosWithPlatformInterceptors = () => {
  const chrome = useChrome();

  const instance = useMemo(() => {
    const memoInstance = axios.create();
    memoInstance.interceptors.request.use(authInterceptorWithChrome(chrome));
    memoInstance.interceptors.response.use(responseDataInterceptor);
    memoInstance.interceptors.response.use(undefined, interceptor401WithChrome(chrome));
    memoInstance.interceptors.response.use(undefined, interceptor500);
    memoInstance.interceptors.response.use(undefined, errorInterceptor);

    return memoInstance;
  }, [chrome]);

  return instance;
};

export const instance = axios.create();
instance.interceptors.request.use(authInterceptor);
instance.interceptors.response.use(responseDataInterceptor);
instance.interceptors.response.use(undefined, interceptor401);
instance.interceptors.response.use(undefined, interceptor500);
instance.interceptors.response.use(undefined, errorInterceptor);

export default instance;
