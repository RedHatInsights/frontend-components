import { getSourcesApi } from '.';
import { delay } from './delay';

export const checkAppAvailability = (id, timeout = 10000, interval = 1000, entity = 'getApplication', updatedTime) => new Promise((res, rej) => {
    const start = Date.now();

    const checkSource = () => getSourcesApi()[entity](id).then(data => {
        const isTimeOuted = (Date.now() - start) >= timeout;

        if (isTimeOuted) {
            if (updatedTime) {
                return ({
                    ...data,
                    availability_status: null,
                    availability_status_error: null
                });
            }

            return data;
        }

        if (data.availability_status === 'available' || data.availability_status === 'unavailable') {
            if (updatedTime && new Date(data.last_checked_at || data.updated_at) > updatedTime) {
                return data;
            }

            if (!updatedTime) {
                return data;
            }
        }

        return delay(interval).then(() => checkSource());
    });

    return checkSource()
    .then(data => res(data))
    .catch(error => rej(error));
});
