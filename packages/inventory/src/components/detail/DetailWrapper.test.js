/* eslint-disable camelcase */
import React from 'react';
import DetailWrapper from './DetailWrapper';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';

describe('DetailWrapper', () => {
    let initialState;
    let mockStore;
    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entityDetails: {
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

        it('should render drawerChildren', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <DetailWrapper drawerChildren={<div className="test">something</div>}/>
            </Provider>);
            expect(toJson(wrapper.find('.pf-l-stack__item .test'), { mode: 'shallow' })).toMatchSnapshot();
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
            expect(store.getActions()[0]).toMatchObject({ payload: { isOpened: false }, type: 'TOGGLE_INVENTORY_DRAWER' });
        });
    });
});
