/* eslint-disable camelcase */
import React from 'react';
import { act } from 'react-dom/test-utils';
import EntityTableToolbar from './EntityTableToolbar';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import { mock, mockTags } from '../../__mock__/hostApi';
import TitleColumn from './TitleColumn';
import debounce from 'lodash/debounce';

jest.mock('lodash/debounce');

describe('EntityTableToolbar', () => {
    let initialState;
    let mockStore;
    beforeEach(() => {
        debounce.mockImplementation(require.requireActual('lodash/debounce'));
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
                total: 500,
                allTags: [
                    { name: 'something', tags: [
                        { count: 5, tag: {
                            namespace: 'something',
                            key: 'some key',
                            value: 'some value'
                        } },
                        { count: 2, tag: {
                            namespace: 'something',
                            key: 'some key',
                            value: null
                        } }
                    ] },
                    {
                        name: 'null',
                        tags: [
                            { count: 2, tag: {
                                namespace: null,
                                key: 'some key',
                                value: null
                            } }
                        ]
                    }
                ]
            }
        };
    });

    describe('DOM', () => {
        it('should render correctly - no data', () => {
            const store = mockStore({
                entities: {
                    loaded: false
                }
            });
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with tags', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar showTags />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
            expect(toJson(wrapper.find('TagsModal'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with no access', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar hasAccess={false} />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
            expect(toJson(wrapper.find('TagsModal'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with items', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar hasItems />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with custom filters', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar filterConfig={{
                    items: [{ label: 'Filter by text' }]
                }} />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with custom activeFilters', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar activeFiltersConfig={{
                    filters: [{
                        category: 'Some',
                        chips: [{
                            name: 'something'
                        }, {
                            name: 'something 2'
                        }]
                    }]
                }} showTags />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with default filters', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    activeFilters: [{ staleFilter: [ 'fresh' ] }]
                }
            });
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with default tag filter', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    activeFilters: [{ tagFilters: [{
                        type: 'tags', key: 'something', category: 'something', values: [{
                            key: 'some key',
                            group: {
                                label: 'Some tag'
                            },
                            value: 'some value'
                        }]
                    }] }]
                }
            });
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly - with children', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar><div>something</div></EntityTableToolbar>
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });

        it('should render correctly', () => {
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar page={1} total={500} perPage={50} />
            </Provider>);
            expect(toJson(wrapper.find('PrimaryToolbar'), { mode: 'shallow' })).toMatchSnapshot();
        });
    });

    describe('API', () => {
        describe('pagination', () => {
            it('should set page ', () => {
                mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
                mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={store}>
                    <EntityTableToolbar page={1} total={500} perPage={50} />
                </Provider>);
                wrapper.find('button[data-action="next"]').first().simulate('click');
                const actions = store.getActions();
                expect(actions.length).toBe(1);
                expect(actions[0]).toMatchObject({ meta: { showTags: false }, type: 'LOAD_ENTITIES_PENDING' });
            });

            it('should set per page ', () => {
                mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
                mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={store}>
                    <EntityTableToolbar page={1} total={500} perPage={50} />
                </Provider>);
                wrapper.find('.pf-c-options-menu__toggle button.pf-c-options-menu__toggle-button').first().simulate('click');
                wrapper.update();
                wrapper.find('ul.pf-c-options-menu__menu button[data-action="per-page-10"]').simulate('click');
                const actions = store.getActions();
                expect(actions.length).toBe(1);
                expect(actions[0]).toMatchObject({ meta: { showTags: false }, type: 'LOAD_ENTITIES_PENDING' });
            });
        });

        describe('delete filter', () => {
            it('should dispatch action on delete filter', () => {
                debounce.mockImplementation(fn => fn);
                mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
                mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={store}>
                    <EntityTableToolbar page={1} total={500} perPage={50} />
                </Provider>);
                const orignalActionsLength = store.getActions().length;
                wrapper.find('.pf-c-chip-group__list li div button').first().simulate('click');
                wrapper.find('.pf-c-chip-group__list li div button').last().simulate('click');
                const actions = store.getActions();
                expect(actions.length).toBe(orignalActionsLength + 1);
                expect(actions[actions.length - 1]).toMatchObject({ meta: { showTags: false }, type: 'LOAD_ENTITIES_PENDING' });
            });

            it('should remove textual filter', () => {
                debounce.mockImplementation(fn => fn);
                mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
                mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
                const store = mockStore({
                    entities: {
                        ...initialState.entities,
                        activeFilters: [{ value: 'hostname_or_id', filter: 'test' }]
                    }
                });
                const wrapper = mount(<Provider store={store}>
                    <EntityTableToolbar page={1} total={500} perPage={50} />
                </Provider>);
                wrapper.find('.pf-c-chip-group__list li div button').first().simulate('click');
                const actions = store.getActions();
                expect(actions[actions.length - 1]).toMatchObject({ meta: { showTags: false }, type: 'LOAD_ENTITIES_PENDING' });
            });

            it('should remove tag filter', () => {
                debounce.mockImplementation(fn => fn);
                mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
                mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
                const store = mockStore({
                    entities: {
                        ...initialState.entities,
                        activeFilters: [{ tagFilters: [{
                            type: 'tags', key: 'something', category: 'something', values: [{
                                key: 'some key',
                                group: {
                                    label: 'Some tag'
                                },
                                value: 'some value'
                            }]
                        }] }]
                    }
                });
                const wrapper = mount(<Provider store={store}>
                    <EntityTableToolbar page={1} total={500} perPage={50} showTags />
                </Provider>);
                wrapper.find('.pf-c-chip-group__list li div button').first().simulate('click');
                const actions = store.getActions();
                expect(actions[actions.length - 1]).toMatchObject({ type: 'ALL_TAGS_PENDING' });
            });

            it('should dispatch action on delete all filters', () => {
                mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
                mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={store}>
                    <EntityTableToolbar page={1} total={500} perPage={50} />
                </Provider>);
                wrapper.find('.ins-c-chip-filters button.pf-m-link').last().simulate('click');
                const actions = store.getActions();
                expect(actions.length).toBe(2);
                expect(actions[actions.length - 1]).toMatchObject({ type: 'CLEAR_FILTERS' });
            });

            it('should call function on delete filter', () => {
                mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
                mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
                const onDelete = jest.fn();
                const store = mockStore(initialState);
                const wrapper = mount(<Provider store={store}>
                    <EntityTableToolbar page={1} total={500} perPage={50} activeFiltersConfig={{
                        onDelete
                    }} />
                </Provider>);
                wrapper.find('.pf-c-chip-group__list li div button').first().simulate('click');
                expect(onDelete).toHaveBeenCalled();
            });
        });

        it('should call onRefresh', () => {
            const onRefresh = jest.fn((_par, callback) => callback());
            debounce.mockImplementation(fn => fn);
            mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
            mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
            const store = mockStore(initialState);
            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar page={1} total={500} perPage={50} onRefresh={onRefresh} />
            </Provider>);
            wrapper.find('.pf-c-options-menu__toggle button.pf-c-options-menu__toggle-button').first().simulate('click');
            wrapper.update();
            wrapper.find('ul.pf-c-options-menu__menu button[data-action="per-page-10"]').simulate('click');
            const actions = store.getActions();
            expect(actions[0]).toMatchObject({ type: 'ENTITIES_LOADING' });
        });

        it('trim leading/trailling whitespace ', async () => {
            const onRefresh = jest.fn((_par, callback) => callback());
            debounce.mockImplementation(fn => fn);
            mock.onGet(/\/api\/inventory\/v1\/hosts.*/).reply(200, {});
            mockTags.onGet(/\/api\/inventory\/v1.*/).reply(200, { results: [] });
            const store = mockStore(initialState);

            const wrapper = mount(<Provider store={store}>
                <EntityTableToolbar page={1} total={500} perPage={50} onRefresh={onRefresh} />
            </Provider>);

            await act(async () => {
                wrapper.find('input[type="text"]').instance().value = '   some-value   ';
                wrapper.find('input[type="text"]').simulate('change');
            });

            const state = store.getState();
            expect(state.entities.activeFilters).toMatchObject(
                [{}, { filter: 'some-value', value: 'hostname_or_id' }]
            );
        });
    });
});
