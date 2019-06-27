import { authInterceptor, interceptor401, responseDataInterceptor } from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import axios from 'axios';
import { ReadOnlyNotification } from '../constants';
const instance = axios.create();

export function errorInterceptor(err) {
    if (!axios.isCancel(err)) {
        const errObject = { ...err };

        if (errObject.response && errObject.response.data && errObject.response.data.errors) {
            const data = errObject.response.data.errors[0];
            throw data;
        }

        throw err;
    }
}

export function readOnlyInterceptor(error) {
    if (error.response && error.response.status === 503) {
        const data = ReadOnlyNotification;
        throw data;
    }

    throw error;
}

instance.interceptors.request.use(authInterceptor);
instance.interceptors.response.use(responseDataInterceptor);
instance.interceptors.response.use(null, interceptor401);
instance.interceptors.response.use(null, readOnlyInterceptor);
instance.interceptors.response.use(null, errorInterceptor);

export default instance;
