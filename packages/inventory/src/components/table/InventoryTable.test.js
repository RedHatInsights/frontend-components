import React from 'react';
import InventoryTable from './InventoryTable';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { BrowserRouter as Router } from 'react-router-dom';
import toJson from 'enzyme-to-json';
import { ConditionalFilter } from '@redhat-cloud-services/frontend-components/components/cjs/ConditionalFilter';

describe('NoSystemsTable', () => {
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
                total: 500,
                sortBy: {
                    index: 1,
                    key: 'one',
                    direction: 'asc'
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ entities: {} });
        const wrapper = mount(<Provider store={ store }>
            <Router>
                <InventoryTable/>
            </Router>
        </Provider>);
        expect(toJson(wrapper.find('ForwardRef').first(), { mode: 'shallow' })).toMatchSnapshot();
    });

    it('should render correctly', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <Router>
                <InventoryTable/>
            </Router>
        </Provider>);
        expect(toJson(wrapper.find('ForwardRef').first(), { mode: 'shallow' })).toMatchSnapshot();
    });

    it('should render correctly - with no access', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <Router>
                <InventoryTable hasAccess={false}/>
            </Router>
        </Provider>);
        expect(toJson(wrapper.find('ForwardRef').first(), { mode: 'shallow' })).toMatchSnapshot();
    });

    it('should render correctly - with no access and full view', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <Router>
                <InventoryTable hasAccess={false} isFullView/>
            </Router>
        </Provider>);
        expect(toJson(wrapper.find('ForwardRef').first(), { mode: 'shallow' })).toMatchSnapshot();
    });

    it('should render correctly with items', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <Router>
                <InventoryTable
                    items={[{ id: 'someId' }]}
                    page={5}
                    perPage={20}
                    total={200}
                    sortBy={{
                        index: 1,
                        key: 'one',
                        direction: 'asc'
                    }}
                />
            </Router>
        </Provider>);
        expect(toJson(wrapper.find('ForwardRef').first(), { mode: 'shallow' })).toMatchSnapshot();
    });

    it('should render correctly with items no totla', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Provider store={ store }>
            <Router>
                <InventoryTable
                    items={[{ id: 'someId' }]}
                    page={5}
                    perPage={20}
                    sortBy={{
                        index: 1,
                        key: 'one',
                        direction: 'asc'
                    }}
                />
            </Router>
        </Provider>);
        expect(toJson(wrapper.find('ForwardRef').first(), { mode: 'shallow' })).toMatchSnapshot();
    });

    describe('hideFilters', () => {
        it('should disable all filters', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <Router>
                    <InventoryTable hideFilters={{ all: true }} showTags/>
                </Router>
            </Provider>);

            expect(wrapper.find(ConditionalFilter)).toHaveLength(0);
        });

        it('should disable only one filter', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <Router>
                    <InventoryTable hideFilters={{ name: true }} showTags/>
                </Router>
            </Provider>);

            expect(wrapper.find(ConditionalFilter).props().items.map(({ value }) => value)).toEqual(
                [ 'stale-status', 'source-registered-with', 'tags' ]
            );
        });

        it('should disable all and enable one', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <Router>
                    <InventoryTable hideFilters={{ all: true, name: false }} showTags/>
                </Router>
            </Provider>);

            expect(wrapper.find(ConditionalFilter).props().items.map(({ value }) => value)).toEqual(
                [ 'name-filter' ]
            );
        });
    });
});
