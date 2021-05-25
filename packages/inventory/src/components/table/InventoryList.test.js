/* eslint-disable react/display-name */
import React from 'react';
import InventoryList from './InventoryList';
import { render, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';

jest.mock('../../redux/actions', () => {
    const actions = jest.requireActual('../../redux/actions');
    const { ACTION_TYPES } = jest.requireActual('../../redux/action-types');
    return {
        __esModule: true,
        ...actions,
        loadEntities: () => ({
            type: ACTION_TYPES.LOAD_ENTITIES,
            payload: () => Promise.resolve([])
        })
    };
});

describe('InventoryList', () => {
    let initialState;
    let mockStore;
    let ref;
    let onRefreshData;

    beforeEach(() => {
        ref = { current: undefined };
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entities: {
                activeFilters: [{}],
                loaded: true,
                rows: [],
                columns: [{ key: 'one', title: 'One' }],
                page: 1,
                perPage: 50,
                total: 500
            }
        };
        onRefreshData = jest.fn().mockImplementation(() => Promise.resolve({ results: [], total: 0 }));
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = render(<MemoryRouter>
            <Provider store={ store }>
                <InventoryList ref={ref} onRefreshData={onRefreshData} loaded />
            </Provider>
        </MemoryRouter>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly - with no access', () => {
        const store = mockStore(initialState);
        const wrapper = render(<MemoryRouter>
            <Provider store={ store }>
                <InventoryList hasAccess={false} ref={ref} onRefreshData={onRefreshData} loaded />
            </Provider>
        </MemoryRouter>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should fire refresh after changing sort', () => {
            const sortBy = {
                index: 1,
                key: 'one',
                direction: 'asc'
            };
            const store = mockStore(initialState);
            const Cmp = (props) => <MemoryRouter>
                <Provider store={ store }>
                    <InventoryList {...props} ref={ref} onRefreshData={onRefreshData} loaded />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp sortBy={sortBy} />);

            onRefreshData.mockClear();

            wrapper.setProps({
                sortBy: {
                    ...sortBy,
                    direction: 'desc'
                }
            });
            wrapper.update();

            expect(onRefreshData).toHaveBeenCalled();
        });

        it('should not fire refresh after changing props', () => {
            const sortBy = {
                index: 1,
                key: 'one',
                direction: 'asc'
            };
            const store = mockStore(initialState);
            const Cmp = (props) => <MemoryRouter>
                <Provider store={ store }>
                    <InventoryList {...props} ref={ref} onRefreshData={onRefreshData} loaded />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp sortBy={sortBy} />);
            onRefreshData.mockClear();
            wrapper.setProps({
                showTags: true
            });
            wrapper.update();
            expect(onRefreshData).not.toHaveBeenCalled();
        });

        it('should fire refresh after changing items', () => {
            const store = mockStore(initialState);
            const Cmp = (props) => <MemoryRouter>
                <Provider store={ store }>
                    <InventoryList {...props} ref={ref} onRefreshData={onRefreshData} loaded />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp items={[{ children: () => <div>test</div>, isOpen: false, id: 'fff' }]} hasItems />);
            onRefreshData.mockClear();
            wrapper.setProps({
                items: [{ children: () => <div>test</div>, isOpen: false, id: 'something' }]
            });
            wrapper.update();
            expect(onRefreshData).toHaveBeenCalled();
        });

        it('should fire refresh calling it from ref', () => {
            const store = mockStore(initialState);
            const Cmp = (props) => <MemoryRouter>
                <Provider store={ store }>
                    <InventoryList {...props} ref={ref} onRefreshData={onRefreshData} loaded />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp items={[{ children: () => <div>test</div>, isOpen: false, id: 'fff' }]} hasItems />);
            onRefreshData.mockClear();
            ref.current.onRefreshData();
            wrapper.update();
            expect(onRefreshData).toHaveBeenCalled();
        });
    });
});
