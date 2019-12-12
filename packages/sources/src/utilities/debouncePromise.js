import awesomeDebouncePromise from 'awesome-debounce-promise';

export default (asyncFunction, debounceTime = 250, options = { onlyResolvesLast: true }) => awesomeDebouncePromise(
    asyncFunction,
    debounceTime,
    options,
);
