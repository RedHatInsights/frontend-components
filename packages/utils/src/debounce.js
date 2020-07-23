import awesomeDebouncePromise from 'awesome-debounce-promise';

export const debounceFunction = (asyncFunction, time = 800, config = { onlyResolvesLast: true }) => awesomeDebouncePromise(
    asyncFunction,
    time,
    config,
);

export default debounceFunction;
