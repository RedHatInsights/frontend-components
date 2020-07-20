/* eslint-disable react/display-name */
import React from 'react';
import InventoryList from './InventoryList';
import { render, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import { mock } from '../../__mock__/hostApi';

describe('InventoryList', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
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
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = render(<Provider store={ store }>
            <InventoryList/>
        </Provider>);
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
            const Cmp = (props) => <Provider store={ store }>
                <InventoryList {...props} />
            </Provider>;
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
            const Cmp = (props) => <Provider store={ store }>
                <InventoryList {...props} />
            </Provider>;
            const wrapper = mount(<Cmp sortBy={sortBy} />);
            wrapper.setProps({
                showTags: true
            });
            wrapper.update();
            const actions = store.getActions();
            expect(actions.length).toBe(0);
        });

        it('should fire refresh after changing items', () => {
            mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
            const store = mockStore(initialState);
            const Cmp = (props) => <Provider store={ store }>
                <InventoryList {...props} />
            </Provider>;
            const wrapper = mount(<Cmp items={[{ children: () => <div>test</div>, isOpen: false, id: 'fff' }]} hasItems />);
            wrapper.setProps({
                items: [{ children: () => <div>test</div>, isOpen: false, id: 'something' }]
            });
            wrapper.update();
            const actions = store.getActions();
            expect(actions[0].type).toBe('LOAD_ENTITIES_PENDING');
        });
    });
});
