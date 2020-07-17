/* eslint-disable camelcase */
import React from 'react';
import Pagination from './Pagination';
import { render, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import { mock } from '../../__mock__/hostApi';

describe('Pagination', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entities: {
                activeFilters: [{}],
                loaded: true
            }
        };
    });

    describe('render', () => {
        it('should render correctly - no data', () => {
            const store = mockStore({ entities: {} });
            const wrapper = render(<Pagination store={ store } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with data', () => {
            const store = mockStore(initialState);
            const wrapper = render(<Pagination store={ store } />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('button[disabled=""]').length).toBe(5);
        });

        it('should render correctly with data and props', () => {
            const store = mockStore(initialState);
            const wrapper = render(<Pagination store={ store } page={1} perPage={50} total={500} />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('button[disabled=""]').length).toBe(2);
        });

        it('should render correctly with data and isFull', () => {
            const store = mockStore(initialState);
            const wrapper = render(<Pagination store={ store } page={1} perPage={50} total={500} isFull />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('button[disabled=""]').length).toBe(2);
        });

        it('should render correctly with hasItems and isLoaded false', () => {
            const store = mockStore(initialState);
            const wrapper = render(<Pagination store={ store } hasItems isLoaded={false} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should call perPage change without onRefresh', () => {
            mock.onGet('/api/inventory/v1/hosts').reply(200, {});
            const store = mockStore(initialState);
            const wrapper = mount(<Pagination store={ store } page={1} perPage={50} total={500} />);
            wrapper.find('.pf-c-options-menu__toggle button').first().simulate('click');
            wrapper.update();
            wrapper.find('ul.pf-c-options-menu__menu li button').first().simulate('click');
            const actions = store.getActions();
            expect(wrapper.find('FooterPagination').instance().state).toMatchObject({ page: 1 });
            expect(actions[0].meta).toMatchObject({ showTags: undefined });
            expect(actions[0].type).toBe('LOAD_ENTITIES_PENDING');
        });

        it('should call perPage change with onRefresh', () => {
            const onRefresh = jest.fn();
            const store = mockStore(initialState);
            const wrapper = mount(<Pagination store={ store } page={1} perPage={50} total={500} onRefresh={onRefresh} />);
            wrapper.find('.pf-c-options-menu__toggle button').first().simulate('click');
            wrapper.update();
            wrapper.find('ul.pf-c-options-menu__menu li button').first().simulate('click');
            const actions = store.getActions();
            expect(onRefresh).toHaveBeenCalled();
            expect(onRefresh.mock.calls[0][0]).toMatchObject({
                page: 1, per_page: 10, filters: [{}]
            });
            expect(actions[0].type).toBe('ENTITIES_LOADING');
        });

        it('should call onSetPage change without onRefresh - button', () => {
            mock.onGet('/api/inventory/v1/hosts').reply(200, {});
            const store = mockStore(initialState);
            const wrapper = mount(<Pagination store={ store } page={1} perPage={50} total={500} />);
            wrapper.find('.pf-c-pagination__nav-control button[data-action="next"]').first().simulate('click');
            wrapper.update();
            const actions = store.getActions();
            expect(wrapper.find('FooterPagination').instance().state).toMatchObject({ page: undefined });
            expect(actions[0].meta).toMatchObject({ showTags: undefined });
            expect(actions[0].type).toBe('LOAD_ENTITIES_PENDING');
        });

        it('should call onSetPage change with onRefresh - button', () => {
            const onRefresh = jest.fn();
            const store = mockStore(initialState);
            const wrapper = mount(<Pagination store={ store } page={1} perPage={50} total={500} onRefresh={onRefresh} />);
            wrapper.find('.pf-c-pagination__nav-control button[data-action="next"]').first().simulate('click');
            wrapper.update();
            const actions = store.getActions();
            expect(onRefresh).toHaveBeenCalled();
            expect(onRefresh.mock.calls[0][0]).toMatchObject({
                page: 2, per_page: 50, filters: [{}]
            });
            expect(actions[0].type).toBe('ENTITIES_LOADING');
        });
    });
});
