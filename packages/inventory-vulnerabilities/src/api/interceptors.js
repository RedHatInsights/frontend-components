import {
    authInterceptor,
    errorInterceptor,
    interceptor401,
    responseDataInterceptor
} from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import axios from 'axios';
const instance = axios.create();

instance.interceptors.request.use(authInterceptor);
instance.interceptors.response.use(responseDataInterceptor);
instance.interceptors.response.use(null, interceptor401);
instance.interceptors.response.use(null, errorInterceptor);

export default instance;
