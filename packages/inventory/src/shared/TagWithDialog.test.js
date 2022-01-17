/* eslint-disable react/display-name */
import React from 'react';
import TagWithDialog from './TagWithDialog';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';

jest.mock('../redux/actions', () => {
  const actions = jest.requireActual('../redux/actions');
  const ACTION_TYPES = jest.requireActual('../redux/action-types');
  return {
    __esModule: true,
    ...actions,
    loadTags: () => ({
      type: ACTION_TYPES.LOAD_TAGS,
      payload: () => Promise.resolve([]),
    }),
  };
});

describe('EntityTable', () => {
  let mockStore;
  beforeEach(() => {
    mockStore = configureStore([promiseMiddleware()]);
  });

  describe('DOM', () => {
    it('should render with count', () => {
      const store = mockStore({});
      const wrapper = mount(<TagWithDialog store={store} count={10} />);
      expect(toJson(wrapper.find('TagWithDialog').first(), { mode: 'shallow' })).toMatchSnapshot();
    });
  });

  describe('API', () => {
    it('should NOT call actions', () => {
      const store = mockStore({});
      const wrapper = mount(<TagWithDialog store={store} count={10} />);
      wrapper.find('button').first().simulate('click');
      const actions = store.getActions();
      expect(actions.length).toBe(0);
    });

    it('should call actions', () => {
      const store = mockStore({});
      const wrapper = mount(<TagWithDialog store={store} count={10} systemId="something" />);
      wrapper.find('button').first().simulate('click');
      const actions = store.getActions();
      expect(actions.length).toBe(2);
    });
  });
});
