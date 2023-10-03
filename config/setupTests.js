/* eslint-disable no-unused-vars */
import { configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import 'whatwg-fetch';
import 'babel-polyfill';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import * as matchers from '@testing-library/jest-dom/dist/matchers';
import MutationObserver from 'mutation-observer';

// ensure the expect is picked up from jest not cypress
global.expect = expect;
// extends with RTL
global.expect.extend(matchers);
configure({ adapter: new Adapter() });
global.SVGPathElement = function () {};
// real MutationObserver polyfill for JSDOM
global.MutationObserver = MutationObserver;

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
