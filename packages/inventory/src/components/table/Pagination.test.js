/* eslint-disable camelcase */
import React from 'react';
import Pagination from './Pagination';
import { render, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';

jest.mock('../../redux/actions', () => {
    const actions = jest.requireActual('../../redux/actions');
    const { ACTION_TYPES } = jest.requireActual('../../redux/action-types');
    return {
        __esModule: true,
        ...actions,
        loadEntities: () => ({
            type: ACTION_TYPES.LOAD_ENTITIES,
            payload: () => Promise.resolve({}),
            meta: { showTags: undefined }
        })
    };
});

describe('Pagination', () => {
    let initialState;
    let mockStore;
    let onRefreshData;

    let WrappedPagination;

    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entities: {
                activeFilters: [{}],
                loaded: true
            }
        };
        onRefreshData = jest.fn().mockImplementation(() => Promise.resolve({ results: [], total: 0 }));

        // eslint-disable-next-line react/display-name
        WrappedPagination = ({ store, ...props }) => <Provider store={store}>
            <Pagination loaded {...props} onRefreshData={onRefreshData}/>
        </Provider>;
    });

    describe('render', () => {
        it('should render correctly - no data', () => {
            const store = mockStore({ entities: {} });
            const wrapper = render(<WrappedPagination store={ store } loaded={false} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with data', () => {
            const store = mockStore(initialState);
            const wrapper = render(<WrappedPagination store={ store } />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('button[disabled=""]').length).toBe(5);
        });

        it('should render correctly - with no access', () => {
            const store = mockStore(initialState);
            const wrapper = render(<WrappedPagination store={ store } hasAccess={false} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with data and props', () => {
            const store = mockStore(initialState);
            const wrapper = render(<WrappedPagination store={ store } page={1} perPage={50} total={500} />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('button[disabled=""]').length).toBe(2);
        });

        it('should render correctly with data and isFull', () => {
            const store = mockStore(initialState);
            const wrapper = render(<WrappedPagination store={ store } page={1} perPage={50} total={500} isFull />);
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('button[disabled=""]').length).toBe(2);
        });
    });

    describe('API', () => {
        it('should call perPage change', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<WrappedPagination store={ store } page={1} perPage={50} total={500} />);
            wrapper.find('.pf-c-options-menu__toggle button').first().simulate('click');
            wrapper.update();
            wrapper.find('ul.pf-c-options-menu__menu li button').first().simulate('click');
            expect(onRefreshData).toHaveBeenCalledWith({ page: 1, per_page: 10 });
        });

        it('should call onSetPage change without', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<WrappedPagination store={ store } page={1} perPage={50} total={500} />);
            wrapper.find('.pf-c-pagination__nav-control button[data-action="next"]').first().simulate('click');
            wrapper.update();
            expect(onRefreshData).toHaveBeenCalledWith({ page: 2 });
        });
    });
});
