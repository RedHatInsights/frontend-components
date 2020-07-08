/* eslint-disable react/display-name */
import React from 'react';
import EntityTable from './EntityTable';
import { render, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import routeData from 'react-router';
import TitleColumn from './TitleColumn';

describe('EntityTable', () => {
    let initialState;
    let mockStore;
    const routerPush = jest.fn();
    beforeEach(() => {
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entities: {
                activeFilters: [{}],
                loaded: true,
                rows: [{
                    id: 'testing-id',
                    one: 'data'
                }],
                columns: [{ key: 'one', title: 'One', renderFunc: TitleColumn }],
                page: 1,
                perPage: 50,
                total: 500
            }
        };
        jest.spyOn(routeData, 'useHistory').mockReturnValue({
            push: routerPush
        });
    });

    describe('DOM', () => {
        it('should render correctly - no data', () => {
            const store = mockStore({
                entities: {
                    loaded: false
                }
            });
            const wrapper = mount(<Provider store={ store }>
                <EntityTable/>
            </Provider>);
            expect(toJson(wrapper.find('EntityTable'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - no rows', () => {
            const store = mockStore({
                entities: {
                    loaded: true,
                    columns: [{ key: 'one', title: 'One' }],
                    rows: []
                }
            });
            const wrapper = render(<Provider store={ store }>
                <EntityTable/>
            </Provider>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly - grid breakpoints', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    columns: [ ...new Array(6) ].map(() => ({ key: 'one', title: 'One' }))
                }
            });
            const wrapper = mount(<Provider store={ store }>
                <EntityTable/>
            </Provider>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - without checkbox', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable hasCheckbox={false} />
            </Provider>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - is expandable', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable expandable />
            </Provider>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with actions', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable actions={[]} />
            </Provider>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        describe('sort by', () => {
            it('should render correctly', () => {
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={ store }>
                    <EntityTable sortBy={{
                        key: 'one',
                        directions: 'asc'
                    }} />
                </Provider>);
                expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
            });

            it('should render correctly - without checkbox', () => {
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={ store }>
                    <EntityTable
                        hasCheckbox={false}
                        sortBy={{
                            key: 'one',
                            directions: 'asc'
                        }}
                    />
                </Provider>);
                expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
            });

            it('should render correctly - is expandable', () => {
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={ store }>
                    <EntityTable
                        expandable
                        sortBy={{
                            key: 'one',
                            directions: 'asc'
                        }}
                    />
                </Provider>);
                expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
            });
        });

        it('should render correctly - compact', () => {
            const store = mockStore(initialState);
            const wrapper = render(<Provider store={ store }>
                <EntityTable variant="compact" />
            </Provider>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with has items', () => {
            const store = mockStore(initialState);
            const wrapper = render(<Provider store={ store }>
                <EntityTable hasItems isLoaded={false} />
            </Provider>);
            expect(toJson(wrapper.find('EntityTable'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly', () => {
            const store = mockStore(initialState);
            const wrapper = render(<Provider store={ store }>
                <EntityTable/>
            </Provider>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should call default onRowClick', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable/>
            </Provider>);
            wrapper.find('table tbody tr a[widget="col"]').first().simulate('click');
            expect(routerPush).toHaveBeenCalled();
        });

        it('should call onRowClick', () => {
            const onRowClick = jest.fn();
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable onRowClick={onRowClick} />
            </Provider>);
            wrapper.find('table tbody tr a[widget="col"]').first().simulate('click');
            expect(onRowClick).toHaveBeenCalled();
        });

        it('should NOT call on expand click', () => {
            const onExpand = jest.fn();
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    rows: [{
                        one: 'data',
                        children: () => <div>something</div>
                    }]
                }
            });
            const wrapper = mount(<Provider store={ store }>
                <EntityTable expandable />
            </Provider>);
            wrapper.find('.pf-c-table__toggle button').first().simulate('click');
            expect(onExpand).not.toHaveBeenCalled();
        });

        it('should call on expand click', () => {
            const onExpand = jest.fn();
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    rows: [{
                        one: 'data',
                        children: () => <div>something</div>
                    }]
                }
            });
            const wrapper = mount(<Provider store={ store }>
                <EntityTable expandable onExpandClick={onExpand} />
            </Provider>);
            wrapper.find('.pf-c-table__toggle button').first().simulate('click');
            expect(onExpand).toHaveBeenCalled();
        });

        it('should call dispatch select cation', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable expandable />
            </Provider>);
            wrapper.find('table tbody tr .pf-c-table__check input').first().simulate('change', {
                target: {
                    value: 'checked'
                }
            });
            const actions = store.getActions();
            expect(actions.length).toBe(1);
            expect(actions[0]).toMatchObject({ payload: { id: 'testing-id', selected: true }, type: 'SELECT_ENTITY' });
        });

        it('should call dispatch select cation', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable expandable />
            </Provider>);
            wrapper.find('table tbody tr .pf-c-table__check input').first().simulate('change', {
                target: {
                    value: 'checked'
                }
            });
            const actions = store.getActions();
            expect(actions.length).toBe(1);
            expect(actions[0]).toMatchObject({ payload: { id: 'testing-id', selected: true }, type: 'SELECT_ENTITY' });
        });

        it('should call dispatch select all cation', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable />
            </Provider>);
            wrapper.find('table thead input[name="check-all"]').first().simulate('change', {
                target: {
                    value: 'checked'
                }
            });
            const actions = store.getActions();
            expect(actions.length).toBe(1);
            expect(actions[0]).toMatchObject({ payload: { id: 0, selected: false }, type: 'SELECT_ENTITY' });
        });

        it('should call dispatch set sort cation', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable />
            </Provider>);
            wrapper.find('table thead th.pf-c-table__sort button').first().simulate('click');
            const actions = store.getActions();
            expect(actions.length).toBe(1);
            expect(actions[0]).toMatchObject({
                payload: { direction: 'asc', index: 1, key: 'one' },
                type: 'CHANGE_SORT'
            });
        });

        it('should call onSort function', () => {
            const onSort = jest.fn();
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={ store }>
                <EntityTable onSort={onSort} />
            </Provider>);
            wrapper.find('table thead th.pf-c-table__sort button').first().simulate('click');
            expect(onSort).toHaveBeenCalled();
        });

        it('should NOT call onSort function', () => {
            const onSort = jest.fn();
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    columns: [{ key: 'health', title: 'Health' }]
                }
            });
            const wrapper = mount(<Provider store={ store }>
                <EntityTable onSort={onSort} />
            </Provider>);
            wrapper.find('table thead th.pf-c-table__sort button').first().simulate('click');
            const actions = store.getActions();
            expect(actions.length).toBe(0);
        });
    });
});
