/* eslint-disable no-unused-vars */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'babel-polyfill';

configure({ adapter: new Adapter() });
global.SVGPathElement = function () {};

global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
};

global.window.insights = {
    ...window.insights || {},
    chrome: {
        ...(window.insights && window.insights.chrome) || {},
        auth: {
            ...(window.insights && window.insights.chrome && window.insights.chrome) || {},
            getUser: () => new Promise((res) => res({
                identity: {
                    // eslint-disable-next-line camelcase
                    account_number: '0',
                    type: 'User',
                    user: {
                        // eslint-disable-next-line camelcase
                        is_org_admin: true
                    }
                }
            }))
        },
        getUserPermissions: () => new Promise((res) => res([]))
    }
};
jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useLayoutEffect: jest.requireActual('react').useEffect
}));
Element.prototype.scrollTo = () => {};
