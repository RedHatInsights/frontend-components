/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable react/display-name */
import React from 'react';
import { act } from 'react-dom/test-utils';
import EntityTable from './EntityTable';
import { render, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import routeData from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import TitleColumn from './TitleColumn';
import InsightsDisconnected from '../../shared/InsightsDisconnected';
import { defaultColumns } from '../../redux/entities';

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
                    one: 'data',
                    system_profile: {}
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable disableDefaultColumns loaded={false}/>
                </Provider>
            </MemoryRouter>);
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
            const wrapper = render(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable disableDefaultColumns loaded/>
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly - with customNoSystemsTable', () => {
            const store = mockStore({
                entities: {
                    loaded: true,
                    columns: [{ key: 'one', title: 'One' }],
                    rows: []
                }
            });
            const wrapper = render(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded noSystemsTable={ <div>NO SYSTEMS</div> } />
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly - grid breakpoints', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    columns: [ ...new Array(6) ].map(() => ({ key: 'one', title: 'One' }))
                }
            });
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - without checkbox', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded hasCheckbox={false} disableDefaultColumns />
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - is expandable', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded expandable disableDefaultColumns />
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with actions', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded actions={[]} disableDefaultColumns />
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
        });

        describe('sort by', () => {
            it('should render correctly', () => {
                const store = mockStore(initialState);
                const wrapper = mount(<MemoryRouter>
                    <Provider store={ store }>
                        <EntityTable loaded disableDefaultColumns sortBy={{
                            key: 'one',
                            directions: 'asc'
                        }} />
                    </Provider>
                </MemoryRouter>);
                expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
            });

            it('should render correctly - without checkbox', () => {
                const store = mockStore(initialState);
                const wrapper = mount(<MemoryRouter>
                    <Provider store={ store }>
                        <EntityTable
                            loaded
                            hasCheckbox={false}
                            disableDefaultColumns
                            sortBy={{
                                key: 'one',
                                directions: 'asc'
                            }}
                        />
                    </Provider>
                </MemoryRouter>);
                expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
            });

            it('should render correctly - is expandable', () => {
                const store = mockStore(initialState);
                const wrapper = mount(<MemoryRouter>
                    <Provider store={ store }>
                        <EntityTable
                            loaded
                            expandable
                            disableDefaultColumns
                            sortBy={{
                                key: 'one',
                                directions: 'asc'
                            }}
                        />
                    </Provider>
                </MemoryRouter>);
                expect(toJson(wrapper.find('Table'), { mode: 'shallow' })).toMatchSnapshot();
            });
        });

        it('should render correctly - compact', () => {
            const store = mockStore(initialState);
            const wrapper = render(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns variant="compact" />
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly with has items', () => {
            const store = mockStore(initialState);
            const wrapper = render(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns hasItems isLoaded={false} />
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper.find('EntityTable'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly', () => {
            const store = mockStore(initialState);
            const wrapper = render(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded/>
                </Provider>
            </MemoryRouter>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render correctly - disabled insights icon', () => {
            initialState = {
                entities: {
                    ...initialState.entities,
                    columns: defaultColumns,
                    rows: [{
                        id: 'testing-id',
                        insights_id: null,
                        system_profile: {}
                    }, {
                        id: 'testing-id-1',
                        insights_id: 'some-id-herse',
                        system_profile: {}
                    }]
                }
            };

            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);

            expect(wrapper.find(InsightsDisconnected)).toHaveLength(1);
        });

        it('should render correctly - custom columns via props', () => {
            initialState = {
                entities: {
                    ...initialState.entities,
                    rows: [{
                        id: 'testing-id',
                        insights_id: null,
                        secret_attribute: 'super_secret_1',
                        display_name: 'name_1',
                        system_profile: {}
                    }, {
                        id: 'testing-id-1',
                        insights_id: 'some-id-herse',
                        secret_attribute: 'super_secret_2',
                        display_name: 'name_2',
                        system_profile: {}
                    }]
                }
            };

            const CustomCell = ({ children }) => <h1>{children}</h1>;

            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable
                        loaded
                        columns={
                            [
                                {
                                    key: 'display_name',
                                    renderFunc: (name) => <CustomCell>{name}</CustomCell>
                                },
                                {
                                    key: 'secret_attribute',
                                    title: 'Secret attribute',
                                    renderFunc: (secret_attribute) => <CustomCell>{secret_attribute}</CustomCell>
                                }
                            ]
                        }
                    />
                </Provider>
            </MemoryRouter>);

            expect(wrapper.find('table').find('th')).toHaveLength(4);
            expect(wrapper.find('table').find('th').last().text()).toEqual('Secret attribute');
            expect(wrapper.find('table').find(CustomCell)).toHaveLength(4);

            const texts = wrapper.find('table').find(CustomCell).map(cell => cell.text());

            expect(texts).toEqual(
                [ 'name_1', 'super_secret_1', 'name_2', 'super_secret_2' ]
            );
        });

        it('should render correctly - custom columns via prop function', () => {
            initialState = {
                entities: {
                    ...initialState.entities,
                    rows: [{
                        id: 'testing-id',
                        insights_id: null,
                        secret_attribute: 'super_secret_1',
                        display_name: 'name_1',
                        system_profile: {}
                    }]
                }
            };

            const CustomCell = ({ children }) => <h1>{children}</h1>;

            const getColumns = jest.fn().mockImplementation(() => [
                {
                    key: 'display_name',
                    title: 'Display name',
                    renderFunc: (name) => <CustomCell>{name}</CustomCell>
                },
                {
                    key: 'secret_attribute',
                    title: 'Secret attribute',
                    renderFunc: (secret_attribute) => <CustomCell>{secret_attribute}</CustomCell>
                }
            ]);

            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable
                        loaded
                        columns={getColumns}
                    />
                </Provider>
            </MemoryRouter>);

            expect(getColumns.mock.calls.length).toEqual(1);
            expect(getColumns).toHaveBeenCalledWith(defaultColumns);

            expect(wrapper.find('table').find('th')).toHaveLength(2);
            expect(wrapper.find('table').find('th').last().text()).toEqual('Secret attribute');
            expect(wrapper.find('table').find(CustomCell)).toHaveLength(2);

            const texts = wrapper.find('table').find(CustomCell).map(cell => cell.text());

            expect(texts).toEqual(
                [ 'name_1', 'super_secret_1' ]
            );
        });

        it('control columns function prop via columnsCounter', async () => {
            initialState = {
                entities: {
                    ...initialState.entities,
                    rows: [{
                        id: 'testing-id',
                        insights_id: null,
                        secret_attribute: 'super_secret_1',
                        display_name: 'name_1',
                        system_profile: {}
                    }]
                }
            };

            const CustomCell = ({ children }) => <h1>{children}</h1>;

            const getColumns = jest.fn().mockImplementation(() => [
                {
                    key: 'display_name',
                    title: 'Display name',
                    renderFunc: (name) => <CustomCell>{name}</CustomCell>
                }
            ]);

            const store = mockStore(initialState);

            class Dummy extends React.Component {
                render() {
                    return (
                        <MemoryRouter>
                            <Provider store={ store }>
                                <EntityTable
                                    loaded
                                    columns={getColumns}
                                    {...this.props}
                                />
                            </Provider>
                        </MemoryRouter>
                    );
                }
            }

            const wrapper = mount(<Dummy />);

            expect(getColumns.mock.calls.length).toEqual(1);

            await act(async () => {
                wrapper.setProps({ some_prop: '1' });
            });
            wrapper.update();

            expect(getColumns.mock.calls.length).toEqual(1);

            await act(async () => {
                wrapper.setProps({ columnsCounter: 1 });
            });
            wrapper.update();

            expect(getColumns.mock.calls.length).toEqual(2);

            await act(async () => {
                wrapper.setProps({ columnsCounter: 1 });
            });
            wrapper.update();

            expect(getColumns.mock.calls.length).toEqual(2);

            await act(async () => {
                wrapper.setProps({ columnsCounter: 2 });
            });
            wrapper.update();

            expect(getColumns.mock.calls.length).toEqual(3);
        });

        it('should disable just one default column', () => {
            initialState = {
                entities: {
                    ...initialState.entities,
                    rows: [{
                        id: 'testing-id',
                        insights_id: null,
                        secret_attribute: 'super_secret_1',
                        display_name: 'name_1',
                        system_profile: {}
                    }]
                }
            };

            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable
                        loaded
                        columns={[]}
                        disableDefaultColumns={[ 'display_name' ]}
                    />
                </Provider>
            </MemoryRouter>);

            const texts = wrapper.find('table').find('th').map(cell => cell.text());
            expect(texts).toEqual(
                [ 'OS', 'Last seen' ]
            );
            expect(wrapper.find('table').find('th')).toHaveLength(2);
        });

        it('should disable just one default column + showTags', () => {
            initialState = {
                entities: {
                    ...initialState.entities,
                    columns: undefined,
                    rows: [{
                        id: 'testing-id',
                        insights_id: null,
                        secret_attribute: 'super_secret_1',
                        display_name: 'name_1',
                        system_profile: {}
                    }]
                }
            };

            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable
                        loaded
                        columns={[]}
                        disableDefaultColumns={[ 'display_name' ]}
                        showTags
                    />
                </Provider>
            </MemoryRouter>);

            const texts = wrapper.find('table').find('th').map(cell => cell.text());
            expect(texts).toEqual(
                [ 'Tags', 'OS', 'Last seen' ]
            );
            expect(wrapper.find('table').find('th')).toHaveLength(3);
        });
    });

    describe('API', () => {
        it('should call default onRowClick', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
            wrapper.find('table tbody tr a[widget="col"]').first().simulate('click');
            expect(routerPush).toHaveBeenCalled();
        });

        it('should call onRowClick', () => {
            const onRowClick = jest.fn();
            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns onRowClick={onRowClick} />
                </Provider>
            </MemoryRouter>);
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns expandable />
                </Provider>
            </MemoryRouter>);
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns expandable onExpandClick={onExpand} />
                </Provider>
            </MemoryRouter>);
            wrapper.find('.pf-c-table__toggle button').first().simulate('click');
            expect(onExpand).toHaveBeenCalled();
        });

        it('should call dispatch select cation', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded expandable disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded expandable disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded onSort={onSort} disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
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
            const wrapper = mount(<MemoryRouter>
                <Provider store={ store }>
                    <EntityTable loaded onSort={onSort} disableDefaultColumns/>
                </Provider>
            </MemoryRouter>);
            wrapper.find('table thead th.pf-c-table__sort button').first().simulate('click');
            const actions = store.getActions();
            expect(actions.length).toBe(0);
        });
    });
});
