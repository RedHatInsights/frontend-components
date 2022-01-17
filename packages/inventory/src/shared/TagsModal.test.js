/* eslint-disable no-import-assign */
import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import TagsModal from './TagsModal';
import debounce from 'lodash/debounce';

import * as api from '../api/api';

jest.mock('lodash/debounce');
describe('TagsModal', () => {
  let initialState;
  let mockStore;
  beforeEach(() => {
    debounce.mockImplementation(jest.requireActual('lodash/debounce'));
    mockStore = configureStore([promiseMiddleware()]);
    initialState = {
      entities: {
        showTagDialog: true,
        tagModalLoaded: true,
      },
    };
  });
  describe('DOM', () => {
    it('should render loading state correctly', () => {
      const store = mockStore({});
      const wrapper = mount(
        <Provider store={store}>
          <TagsModal />
        </Provider>
      );
      expect(toJson(wrapper.find('TagsModal'), { mode: 'shallow' })).toMatchSnapshot();
    });

    it('should render activeSystemTag', () => {
      const store = mockStore({
        entities: {
          ...initialState.entities,
          activeSystemTag: {
            tags: [
              {
                key: 'some',
                value: 'test',
                namespace: 'something',
              },
            ],
            tagsLoaded: true,
            tagsCount: 50,
            page: 1,
            perPage: 10,
          },
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <TagsModal />
        </Provider>
      );
      expect(toJson(wrapper.find('TagsModal'), { mode: 'shallow' })).toMatchSnapshot();
    });

    it('should render alltags', () => {
      const store = mockStore({
        entities: {
          ...initialState.entities,
          allTagsLoaded: true,
          allTagsTotal: 50,
          allTagsPagination: {
            page: 1,
            perPage: 10,
          },
          allTags: [
            {
              tags: [
                {
                  tag: {
                    key: 'some',
                    value: 'test',
                    namespace: 'something',
                  },
                },
              ],
            },
          ],
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <TagsModal store={store} />
        </Provider>
      );
      expect(toJson(wrapper.find('TagsModal'), { mode: 'shallow' })).toMatchSnapshot();
    });
  });

  describe('API', () => {
    beforeEach(() => {
      api.getTags = jest.fn().mockImplementation(() => Promise.resolve());
      api.getAllTags = jest.fn().mockImplementation(() => Promise.resolve());
    });

    it('should NOT call onApply select correct tag', () => {
      const onApply = jest.fn();
      const store = mockStore({
        entities: {
          ...initialState.entities,
          allTagsLoaded: true,
          allTagsTotal: 50,
          allTagsPagination: {
            page: 1,
            perPage: 10,
          },
          allTags: [
            {
              tags: [
                {
                  tag: {
                    key: 'some',
                    value: 'test',
                    namespace: 'something',
                  },
                },
              ],
            },
          ],
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <TagsModal />
        </Provider>
      );
      wrapper
        .find('tbody tr .pf-c-table__check input')
        .first()
        .simulate('change', {
          target: {
            value: 'checked',
          },
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
            perPage: 10,
          },
          allTags: [
            {
              tags: [
                {
                  tag: {
                    key: 'some',
                    value: 'test',
                    namespace: 'something',
                  },
                },
              ],
            },
          ],
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <TagsModal onApply={onApply} />
        </Provider>
      );
      wrapper
        .find('tbody tr .pf-c-table__check input')
        .first()
        .simulate('change', {
          target: {
            value: 'checked',
          },
        });
      wrapper.find('.pf-c-modal-box__footer .pf-c-button.pf-m-primary').first().simulate('click');
      expect(onApply).toHaveBeenCalled();
    });

    it('should toggle modal', () => {
      const store = mockStore({
        entities: {
          ...initialState.entities,
          allTagsLoaded: true,
          allTagsTotal: 50,
          allTagsPagination: {
            page: 1,
            perPage: 10,
          },
          allTags: [
            {
              tags: [
                {
                  tag: {
                    key: 'some',
                    value: 'test',
                    namespace: 'something',
                  },
                },
              ],
            },
          ],
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <TagsModal />
        </Provider>
      );
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
            perPage: 10,
          },
          allTags: [
            {
              tags: [
                {
                  tag: {
                    key: 'some',
                    value: 'test',
                    namespace: 'something',
                  },
                },
              ],
            },
          ],
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <TagsModal />
        </Provider>
      );
      wrapper.find('.pf-c-pagination__nav button[data-action="next"]').first().simulate('click');
      const actions = store.getActions();
      expect(actions[0]).toMatchObject({ type: 'ALL_TAGS_PENDING' });
    });
  });
});
