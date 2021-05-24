/* eslint-disable camelcase */
import React from 'react';
import DetailWrapper from './DetailWrapper';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import { mock } from '../../__mock__/systemIssues';

describe('DetailWrapper', () => {
    mock.onGet('/api/patch/v1/systems/test-id').reply(200, 'test');
    mock.onGet('/api/insights/v1/system/test-id/reports/').reply(200, 'test');
    mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=2').reply(200, 'low-test');
    mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=4').reply(200, 'moderate-test');
    mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=5').reply(200, 'important-test');
    mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=7').reply(200, 'critical-test');
    mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=2').reply(500);
    mock.onPost('/api/compliance/graphql').reply(200, 'test');
    let initialState;
    let mockStore;
    const _Date = Date;
    const currDate = new Date('1970');
    beforeAll(() => {
        /*eslint no-global-assign:off*/
        Date = class extends Date {
            constructor(...props) {
                if (props.length > 0) {
                    return new _Date(...props);
                }

                return currDate;
            }

            static now() {
                return new _Date('1970').getTime();
            }
        };
    });

    afterAll(() => {
        Date = _Date;
    });
    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entityDetails: {
                loaded: true,
                entity: {
                    id: 'some-id',
                    updated: new Date(),
                    culled_timestamp: new Date(),
                    stale_warning_timestamp: new Date(),
                    stale_timestamp: new Date()
                },
                isToggleOpened: true
            }
        };
    });

    describe('DOM', () => {
        it('should render without data', () => {
            const store = mockStore({
                entityDetails: {}
            });
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper/>
            </Provider>);
            expect(toJson(wrapper.find('DetailWrapper'), { mode: 'deep' })).toMatchSnapshot();
        });

        it('should render with data', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper/>
            </Provider>);
            expect(toJson(wrapper.find('DetailWrapper'), { mode: 'deep' })).toMatchSnapshot();
        });

        it('should pass correct props to BasicInfo', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper/>
            </Provider>);
            expect(toJson(wrapper.find('BasicInfo'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render Wrapper', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper Wrapper={() => <div className="test">something</div>}/>
            </Provider>);
            expect(toJson(wrapper.find('.ins-c-inventory__drawer--facts'), { mode: 'deep' })).toMatchSnapshot();
        });

        it('should render children', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper>
                    <div className="test">something</div>
                </DetailWrapper>
            </Provider>);
            expect(toJson(wrapper.find('.pf-c-drawer__body .test'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should calculate classnames', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper className="test"/>
            </Provider>);
            expect(wrapper.find('.ins-c-inventory__drawer.test')).toBeDefined();
        });
    });

    describe('API', () => {
        it('should call open', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper className="test"/>
            </Provider>);
            wrapper.find('.pf-c-drawer__close button').simulate('click');
            const actions = store.getActions();
            expect(actions[actions.length - 1]).toMatchObject({ payload: { isOpened: false }, type: 'TOGGLE_INVENTORY_DRAWER' });
        });
    });
});
