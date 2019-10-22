import { axiosInstance } from './index';
import { COST_MANAGEMENT_API_BASE } from './constants';

export const postBillingSource = (data) => new Promise((resolve, reject) => {
    const start = Date.now();
    const timeout = 10000;

    const postBillingSourceInner = () =>  axiosInstance
    .post(`${COST_MANAGEMENT_API_BASE}/sources/billing_source/`, data)
    .then(({ data }) => resolve(data))
    .catch(() => (Date.now() - start) >= timeout ?
        reject(new Error('Timeout expired')) :
        setTimeout(() => postBillingSourceInner(data), 1000)
    );

    return postBillingSourceInner(data);
});
