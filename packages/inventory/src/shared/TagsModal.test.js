import React from 'react';
import { shallow, mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import TagsModal from './TagsModal';
import debounce from 'lodash/debounce';

jest.mock('lodash/debounce');
describe('TagsModal', () => {
    let initialState;
    let mockStore;
    beforeEach(() => {
        debounce.mockImplementation(require.requireActual('lodash/debounce'));
        mockStore = configureStore([ promiseMiddleware() ]);
        initialState = {
            entities: {
                showTagDialog: true
            }
        };
    });
    describe('DOM', () => {
        it('should render loading state correctly', () => {
            const store = mockStore({});
            const wrapper = shallow(<TagsModal store={store} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render activeSystemTag', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    activeSystemTag: {
                        tags: [{
                            key: 'some',
                            value: 'test',
                            namespace: 'something'
                        }],
                        tagsLoaded: true,
                        tagsCount: 50,
                        page: 1,
                        perPage: 10
                    }
                }
            });
            const wrapper = shallow(<TagsModal store={store} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should render alltags', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    allTagsLoaded: true,
                    allTagsTotal: 50,
                    allTagsPagination: {
                        page: 1,
                        perPage: 10
                    },
                    allTags: [{
                        tags: [{
                            tag: {
                                key: 'some',
                                value: 'test',
                                namespace: 'something'
                            }
                        }]
                    }]
                }
            });
            const wrapper = shallow(<TagsModal store={store} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should NOT call onApply select correct tag', () => {
            const onApply = jest.fn();
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    allTagsLoaded: true,
                    allTagsTotal: 50,
                    allTagsPagination: {
                        page: 1,
                        perPage: 10
                    },
                    allTags: [{
                        tags: [{
                            tag: {
                                key: 'some',
                                value: 'test',
                                namespace: 'something'
                            }
                        }]
                    }]
                }
            });
            const wrapper = mount(<TagsModal store={store} />);
            wrapper.find('tbody tr .pf-c-table__check input').first().simulate('change', {
                target: {
                    value: 'checked'
                }
            });
            expect(wrapper.find('TagsModal').first().instance().state.selected[0]).toMatchObject({
                id: 'something/some=test'
            });
            wrapper.find('.pf-c-modal-box__footer .pf-c-button.pf-m-primary').first().simulate('click');
            expect(onApply).not.toHaveBeenCalled();
        });

        it('should call onApply select correct tag', () => {
            const onApply = jest.fn();
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    allTagsLoaded: true,
                    allTagsTotal: 50,
                    allTagsPagination: {
                        page: 1,
                        perPage: 10
                    },
                    allTags: [{
                        tags: [{
                            tag: {
                                key: 'some',
                                value: 'test',
                                namespace: 'something'
                            }
                        }]
                    }]
                }
            });
            const wrapper = mount(<TagsModal store={store} onApply={onApply} />);
            wrapper.find('tbody tr .pf-c-table__check input').first().simulate('change', {
                target: {
                    value: 'checked'
                }
            });
            expect(wrapper.find('TagsModal').first().instance().state.selected[0]).toMatchObject({
                id: 'something/some=test'
            });
            wrapper.find('.pf-c-modal-box__footer .pf-c-button.pf-m-primary').first().simulate('click');
            expect(onApply).toHaveBeenCalled();
        });

        it('should filter tags by', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    activeSystemTag: {
                        tags: [{
                            key: 'some',
                            value: 'test',
                            namespace: 'something'
                        }],
                        tagsLoaded: true,
                        tagsCount: 50,
                        page: 1,
                        perPage: 10
                    }
                }
            });
            const wrapper = mount(<TagsModal store={store} />);
            wrapper.find('.ins-c-conditional-filter input').first().simulate('change', {
                target: {
                    value: 'something'
                }
            });
            expect(wrapper.find('TagsModal').first().instance().state.filterTagsBy).toBe('something');
        });

        it('should toggle modal', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    allTagsLoaded: true,
                    allTagsTotal: 50,
                    allTagsPagination: {
                        page: 1,
                        perPage: 10
                    },
                    allTags: [{
                        tags: [{
                            tag: {
                                key: 'some',
                                value: 'test',
                                namespace: 'something'
                            }
                        }]
                    }]
                }
            });
            const wrapper = mount(<TagsModal store={store} />);
            wrapper.find('.pf-c-button.pf-m-plain').first().simulate('click');
            const actions = store.getActions();
            expect(actions[0]).toMatchObject({ payload: { isOpen: false }, type: 'TOGGLE_TAG_MODAL' });
        });

        it('should fetch additional tags when all tags shown', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    allTagsLoaded: true,
                    allTagsTotal: 50,
                    allTagsPagination: {
                        page: 1,
                        perPage: 10
                    },
                    allTags: [{
                        tags: [{
                            tag: {
                                key: 'some',
                                value: 'test',
                                namespace: 'something'
                            }
                        }]
                    }]
                }
            });
            const wrapper = mount(<TagsModal store={store} />);
            wrapper.find('.pf-c-pagination__nav button[data-action="next"]').first().simulate('click');
            const actions = store.getActions();
            expect(actions[0]).toMatchObject({ type: 'ALL_TAGS_PENDING' });
        });

        it('should fetch next tags for system', () => {
            const store = mockStore({
                entities: {
                    ...initialState.entities,
                    activeSystemTag: {
                        id: 'something',
                        tags: [{
                            key: 'some',
                            value: 'test',
                            namespace: 'something'
                        }],
                        tagsLoaded: true,
                        tagsCount: 50,
                        page: 1,
                        perPage: 10
                    }
                }
            });
            const wrapper = mount(<TagsModal store={store} />);
            wrapper.find('.pf-c-pagination__nav button[data-action="next"]').first().simulate('click');
            const actions = store.getActions();
            expect(actions[0]).toMatchObject({ meta: { systemId: 'something', tagsCount: 50 }, type: 'LOAD_TAGS_PENDING' });
        });

        it('should call debounced get tags in detail', () => {
            debounce.mockImplementation(fn => fn);
            const store = mockStore({
                entityDetails: {
                    ...initialState.entities,
                    activeSystemTag: {
                        id: 'something',
                        tags: [{
                            key: 'some',
                            value: 'test',
                            namespace: 'something'
                        }],
                        tagsLoaded: true,
                        tagsCount: 50,
                        page: 1,
                        perPage: 10
                    }
                }
            });
            const wrapper = mount(<TagsModal store={store} />);
            wrapper.find('.ins-c-conditional-filter input').first().simulate('change', {
                target: {
                    value: 'something'
                }
            });
            const actions = store.getActions();
            expect(actions[0]).toMatchObject({ meta: { systemId: 'something', tagsCount: 50 }, type: 'LOAD_TAGS_PENDING' });
        });
    });
});
