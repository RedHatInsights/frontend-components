import { getSourcesApi } from './index';

export const handleError = (id, error) => {
    if (!error) {
        return 'Undefined error';
    }

    if (typeof error === 'string') {
        return error;
    }

    const url = error.config.url;
    let detail;

    if (typeof error.response.data === 'string') {
        detail = error.response.data;
    } else {
        detail = error.response.data.errors[0].detail;
    }

    const detailInfo = error.detailInfo ? `(${error.detailInfo}) ` : ``;

    return getSourcesApi().deleteSource(id)
    .then(() => {
        return `${detailInfo}${url}: ${detail}`;
    })
    .catch((errorDelete) => {
        return `${detailInfo}${url}: ${detail}. The source was not removed, try remove it later: ${errorDelete.response.data.errors[0].detail}`; }
    );
};
