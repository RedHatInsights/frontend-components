import { getSourcesApi } from '.';
import { delay } from './costManagementAuthentication';

export const checkAppAvailability = (id, timeout = 10000, interval = 1000, entity = 'getApplication') => new Promise((res, rej) => {
    const start = Date.now();

    const checkSource = () => getSourcesApi()[entity](id).then(data => {
        const isTimeOuted = (Date.now() - start) >= timeout;

        if (data.availability_status === 'available' || data.availability_status === 'unavailable' || isTimeOuted) {
            return data;
        }

        return delay(interval).then(() => checkSource());
    });

    return checkSource()
    .then(data => res(data))
    .catch(error => rej(error));
});
