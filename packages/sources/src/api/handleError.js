import { getSourcesApi } from './index';
import get from 'lodash/get';

export const handleError = (error, sourceId = undefined) => {
    if (!error) {
        return 'Undefined error';
    }

    if (typeof error === 'string') {
        return error;
    }

    const detail = get(error, 'errors[0].detail', JSON.stringify(error, null, 2));

    if (!sourceId) {
        return detail;
    }

    return getSourcesApi().deleteSource(sourceId)
    .then(() => detail)
    .catch((errorDelete) => {
        const errorDeleteDetail = get(errorDelete, 'errors[0].detail', JSON.stringify(errorDelete, null, 2));

        return `${detail}. The source was not removed, try remove it later: ${errorDeleteDetail}`; }
    );
};
