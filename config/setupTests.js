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
Element.prototype.scrollTo = () => {};
