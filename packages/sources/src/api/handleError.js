import { getSourcesApi } from './index';
import get from 'lodash/get';

export const handleError = (error, sourceId = undefined) => {
    let errorMessage;

    if (!error) {
        errorMessage = 'Undefined error';
    }

    if (!errorMessage && typeof error === 'string') {
        errorMessage = error;
    }

    if (!errorMessage && !sourceId) {
        const detail = get(error, 'errors[0].detail', JSON.stringify(error, null, 2));
        errorMessage = detail;
    }

    if (!sourceId) {
        return errorMessage;
    }

    return getSourcesApi().deleteSource(sourceId)
    .then(() => errorMessage)
    .catch((errorDelete) => {
        const errorDeleteDetail = get(errorDelete, 'errors[0].detail', JSON.stringify(errorDelete, null, 2));

        return `${errorMessage}. The source was not removed, try remove it later: ${errorDeleteDetail}`; }
    );
};
