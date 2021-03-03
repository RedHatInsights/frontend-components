import awesomeDebouncePromise from 'awesome-debounce-promise';

/**
 * Async debounce factory functions.
 * @param {Function} asyncFunction async function to be debounced
 * @param {number} time delay in ms
 * @param {Object} config additional config. See <a href="https://github.com/slorber/awesome-debounce-promise#options">for more details</a>.
 */
export const debounceFunction = (asyncFunction, time = 800, config = { onlyResolvesLast: true }) => awesomeDebouncePromise(
    asyncFunction,
    time,
    config
);

export default debounceFunction;
