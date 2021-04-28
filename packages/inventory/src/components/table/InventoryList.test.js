/* eslint-disable react/display-name */
import React from 'react';
import InventoryList from './InventoryList';
import { render, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { MemoryRouter } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import { mock } from '../../__mock__/hostApi';
import * as api from '../../api/api';

describe('InventoryList', () => {
    let initialState;
    let mockStore;
    let ref;

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
        // eslint-disable-next-line no-import-assign
        api.getEntities = jest.fn().mockImplementation(() => Promise.resolve({ results: [], total: 0 }));
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = render(<MemoryRouter>
            <Provider store={ store }>
                <InventoryList ref={ref}/>
            </Provider>
        </MemoryRouter>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly - with no access', () => {
        const store = mockStore(initialState);
        const wrapper = render(<MemoryRouter>
            <Provider store={ store }>
                <InventoryList hasAccess={false} ref={ref}/>
            </Provider>
        </MemoryRouter>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('API', () => {
        it('should fire refresh after changing sort', () => {
            mock.onGet('/api/inventory/v1/hosts').reply(200, {});
            const sortBy = {
                index: 1,
                key: 'one',
                direction: 'asc'
            };
            const store = mockStore(initialState);
            const Cmp = (props) => <MemoryRouter>
                <Provider store={ store }>
                    <InventoryList {...props} ref={ref} />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp sortBy={sortBy} />);
            wrapper.setProps({
                sortBy: {
                    ...sortBy,
                    direction: 'desc'
                }
            });
            wrapper.update();
            const actions = store.getActions();
            expect(actions[0].type).toBe('LOAD_ENTITIES_PENDING');
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
                    <InventoryList {...props} ref={ref} />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp sortBy={sortBy} />);
            const actionsAfterMount = store.getActions();
            wrapper.setProps({
                showTags: true
            });
            wrapper.update();
            const actions = store.getActions();
            expect(actions.length).toBe(actionsAfterMount.length);
        });

        it('should fire refresh after changing items', () => {
            mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
            const store = mockStore(initialState);
            const Cmp = (props) => <MemoryRouter>
                <Provider store={ store }>
                    <InventoryList {...props} ref={ref} />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp items={[{ children: () => <div>test</div>, isOpen: false, id: 'fff' }]} hasItems />);
            const initialActions = store.getActions();
            expect(initialActions.map(({ type }) => type)).toEqual(
                [ 'LOAD_ENTITIES_PENDING' ]
            );
            wrapper.setProps({
                items: [{ children: () => <div>test</div>, isOpen: false, id: 'something' }]
            });
            wrapper.update();
            const actions = store.getActions();
            expect(actions.map(({ type }) => type)).toEqual(
                [ 'LOAD_ENTITIES_PENDING', 'LOAD_ENTITIES_PENDING' ]
            );
        });

        it('should fire refresh calling it from ref', () => {
            mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
            const store = mockStore(initialState);
            const Cmp = (props) => <MemoryRouter>
                <Provider store={ store }>
                    <InventoryList {...props} ref={ref} />
                </Provider>
            </MemoryRouter>;
            const wrapper = mount(<Cmp items={[{ children: () => <div>test</div>, isOpen: false, id: 'fff' }]} hasItems />);
            const initialActions = store.getActions();
            expect(initialActions.map(({ type }) => type)).toEqual(
                [ 'LOAD_ENTITIES_PENDING' ]
            );
            ref.current.onRefreshData();
            wrapper.update();
            const actions = store.getActions();
            expect(actions.map(({ type }) => type)).toEqual(
                [ 'LOAD_ENTITIES_PENDING', 'LOAD_ENTITIES_PENDING' ]
            );
        });
    });
});
