// @ts-nocheck

/* eslint-disable no-unused-vars */
require( 'whatwg-fetch');
require('@testing-library/jest-dom');
const { expect } = require('@jest/globals');
const matchers = require('@testing-library/jest-dom/dist/matchers');
const MutationObserver = require('mutation-observer');
const crypto = require('crypto');

// ensure the expect is picked up from jest not cypress
global.expect = expect;
// extends with RTL
global.expect.extend(matchers);
global.SVGPathElement = function () {};
// real MutationObserver polyfill for JSDOM
global.MutationObserver = MutationObserver;

// Crypto object polyfill for JSDOM
global.window.crypto = {
  ...crypto,
}
// in case the cryto package is mangled and the method does not exist
if(!global.window.crypto.randomUUID) {
  global.window.crypto.randomUUID = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
}



global.window.insights = {
  ...(window.insights || {}),
  chrome: {
    ...((window.insights && window.insights.chrome) || {}),
    auth: {
      ...((window.insights && window.insights.chrome && window.insights.chrome) || {}),
      getUser: () =>
        new Promise((res) =>
          res({
            identity: {
              // eslint-disable-next-line camelcase
              account_number: '0',
              type: 'User',
              user: {
                // eslint-disable-next-line camelcase
                is_org_admin: true,
              },
            },
          })
        ),
    },
    getUserPermissions: () => new Promise((res) => res([])),
    isBeta: () => false,
  },
};
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useLayoutEffect: jest.requireActual('react').useEffect,
}));

// Suppress known PatternFly-internal console warnings/errors that cannot be fixed
// from consuming code. These are tracked upstream in PatternFly and do not indicate
// issues in our components.
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const suppressedPatterns = [
  // PF Toolbar passes ouiaSafe prop to DOM div (PF internal)
  /ouiaSafe/,
  // PF Popper/Popover have internal async state updates that fire outside act()
  /inside a test was not wrapped in act/,
  // PF typeahead MenuToggle nests a clear <button> inside the toggle <button>
  /cannot appear as a descendant of/,
  // react-intl IntlProvider uses legacy defaultProps pattern
  /Support for defaultProps will be removed/,
];

// React may pass format strings with %s placeholders or pre-formatted messages.
// Join all args to match against the full message content.
const matchesSuppressed = (args) => {
  const message = args.map(String).join(' ');
  return suppressedPatterns.some((pattern) => pattern.test(message));
};

console.error = (...args) => {
  if (matchesSuppressed(args)) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (matchesSuppressed(args)) {
    return;
  }
  originalConsoleWarn(...args);
};
Element.prototype.scrollTo = () => {};
