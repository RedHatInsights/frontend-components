import awesomeDebouncePromise from 'awesome-debounce-promise';

export default (asyncFunction, time = 800, config = { onlyResolvesLast: true }) => awesomeDebouncePromise(
    asyncFunction,
    time,
    config,
);
