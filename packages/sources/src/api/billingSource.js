import axios from 'axios';
import { COST_MANAGEMENT_API_BASE } from './constants';

const resolveInterceptor = response => response.data || response;
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(resolveInterceptor);
axiosInstance.interceptors.request.use(async (config) => {
    await window.insights.chrome.auth.getUser();
    return config;
});
axiosInstance.interceptors.response.use(null, error => { throw { ...error.response }; });

export const getAxiosInstance = () => axiosInstance;

export const postBillingSource = (data) => getAxiosInstance().get(`${COST_MANAGEMENT_API_BASE}/costmodels/`, data).then(({ data }) =>  data);
