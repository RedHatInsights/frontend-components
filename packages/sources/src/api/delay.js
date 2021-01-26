export const delay = (interval, prms) => {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, prms), interval);
    });
};
