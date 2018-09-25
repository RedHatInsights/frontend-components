const memoize = fn => {
    const cache = {};
    return (...args) => {
        const strigyfiedArgs = JSON.stringify(args);
        const result = cache[strigyfiedArgs] = cache[strigyfiedArgs] || fn(...args);
        // if no configuration is passed to validator it will call it imidiatelly
        if (typeof args[0] !== 'object') {return result();}

        return result;
    };
};

export const required = memoize(({ message } = { message: 'Required' }) => {
    return value => value && value.length > 0 ? undefined : message;
});

export const minLength = treshold =>
    value =>
        !value || value.length === 0
            ? undefined
            : value.length >= treshold
                ? undefined
                : `Should be atleast ${treshold} long`;
