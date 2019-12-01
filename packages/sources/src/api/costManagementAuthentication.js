import { axiosInstance } from './index';
import { COST_MANAGEMENT_API_BASE } from './constants';

const delay = (interval, prms) => {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, prms), interval);
    });
};

export function patchSource(data, timeout = 10000, interval = 1000) {
    return new Promise((res, rej) => {
        const start = Date.now();
        const { id, ...payload } = data;

        const checkSource = () => axiosInstance
        .get(`${COST_MANAGEMENT_API_BASE}/sources/${id}/`)
        .catch(error => {
            if ((Date.now() - start) >= timeout) {
                return Promise.reject(`Cost Management failed tracking source: ${JSON.stringify(error)}`);
            }

            return delay(interval).then(() => checkSource());
        });

        return checkSource()
        .then(() => axiosInstance.patch(`${COST_MANAGEMENT_API_BASE}/sources/${id}/`, payload))
        .then(data => res(data))
        .catch(error => rej(error));
    });
}
