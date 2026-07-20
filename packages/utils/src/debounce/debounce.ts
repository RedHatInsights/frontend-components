import awesomeDebouncePromise from 'awesome-debounce-promise';

/**
 * Async debounce factory functions.
 * @param {Function} asyncFunction async function to be debounced
 * @param {number} [time = 800] delay in ms
 * @param {Object} [config = {onlyResolvesLast: true}] <a target="_blank" href="https://github.com/slorber/awesome-debounce-promise#options">more details</a>
 */
export const debounceFunction = (asyncFunction: (...args: unknown[]) => Promise<unknown>, time = 800, config = { onlyResolvesLast: true }) =>
  awesomeDebouncePromise(asyncFunction, time, config);

export default debounceFunction;
