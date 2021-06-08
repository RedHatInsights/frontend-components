/* eslint-disable camelcase */
import React from 'react';
import BasicInfo from './BasicInfo';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';

describe('BasicInfo', () => {
    let initialState;
    let mockStore;
    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entityDetails: {
                entity: {
                    display_name: 'something',
                    id: 'some-id',
                    tags: [
                        { namespace: 'one', key: 'key', value: 'value' },
                        { key: 'key', value: 'value' },
                        { namespace: 'one', key: 'key' },
                        { key: 'key' }
                    ]
                }
            }
        };
    });

    it('should render without data', () => {
        const store = mockStore({
            entityDetails: {}
        });
        const wrapper = mount(<Provider store={ store }>
            <BasicInfo/>
        </Provider>);
        expect(toJson(wrapper.find('BasicInfo'), { mode: 'deep' })).toMatchSnapshot();
        expect(wrapper.find('.pf-l-stack__item').length).toBe(1);
        expect(wrapper.find('.pf-l-split__item').length).toBe(2);
    });

    it('should render with data', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <BasicInfo/>
        </Provider>);
        expect(toJson(wrapper.find('BasicInfo'), { mode: 'deep' })).toMatchSnapshot();
        expect(wrapper.find('.pf-l-stack__item').length).toBe(1);
        expect(wrapper.find('.pf-l-split__item').length).toBe(2);
    });

    it('should render with no inv link', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <BasicInfo hideInvLink/>
        </Provider>);
        expect(toJson(wrapper.find('BasicInfo'), { mode: 'deep' })).toMatchSnapshot();
        expect(wrapper.find('.pf-l-stack__item').length).toBe(1);
        expect(wrapper.find('.pf-l-split__item').length).toBe(1);
    });

    it('should render with tags', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <BasicInfo showTags/>
        </Provider>);
        expect(toJson(wrapper.find('BasicInfo'), { mode: 'deep' })).toMatchSnapshot();
        expect(wrapper.find('.pf-l-stack__item').length).toBe(2);
        expect(wrapper.find('Chip').length).toBe(4);
    });
});
