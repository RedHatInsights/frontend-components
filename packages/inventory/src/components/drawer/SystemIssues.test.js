/* eslint-disable camelcase */
import React from 'react';
import SystemIssues from './SystemIssues';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import toJson from 'enzyme-to-json';
import { mock } from '../../__mock__/systemIssues';

describe('SystemIssues', () => {
  let initialState;
  let mockStore;
  mock.onGet('/api/patch/v1/systems/test-id').reply(200, 'test');
  mock.onGet('/api/insights/v1/system/test-id/reports/').reply(200, 'test');
  mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=2').reply(200, 'low-test');
  mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=4').reply(200, 'moderate-test');
  mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=5').reply(200, 'important-test');
  mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=7').reply(200, 'critical-test');
  mock.onGet('/api/vulnerability//v1/systems/test-id/cves?page=1&page_size=1&impact=2').reply(500);
  mock.onPost('/api/compliance/graphql').reply(200, 'test');
  beforeEach(() => {
    mockStore = configureStore([promiseMiddleware()]);
    initialState = {
      entityDetails: {
        entity: {
          id: 'test-id',
        },
        systemIssues: {
          advisor: {
            isLoaded: true,
            criticalCount: [
              {
                total_risk: 5,
              },
            ],
          },
          compliance: {
            isLoaded: true,
            profiles: [
              {
                id: 'something',
                name: 'some name',
              },
            ],
          },
          patch: {
            isLoaded: true,
            bug: {
              count: 1,
            },
            enhancement: {
              count: 1,
            },
            security: {
              count: 1,
            },
          },
          cve: {
            isLoaded: true,
            critical: {
              count: 1,
            },
            moderate: {
              count: 2,
            },
            important: {
              count: 3,
            },
            low: {
              count: 4,
            },
          },
        },
      },
    };
  });
  describe('DOM', () => {
    it('should render without any data', () => {
      const store = mockStore({
        entityDetails: {},
      });
      const wrapper = mount(
        <Provider store={store}>
          <SystemIssues />
        </Provider>
      );
      expect(toJson(wrapper.find('SystemIssues'), { mode: 'deep' })).toMatchSnapshot();
    });

    it('should render correctly with data - closed', () => {
      const store = mockStore(initialState);
      const wrapper = mount(
        <Provider store={store}>
          <SystemIssues />
        </Provider>
      );
      expect(toJson(wrapper.find('SystemIssues'), { mode: 'deep' })).toMatchSnapshot();
    });

    it('should render correctly with data - opened', () => {
      const store = mockStore(initialState);
      const wrapper = mount(
        <Provider store={store}>
          <SystemIssues isOpened />
        </Provider>
      );
      expect(toJson(wrapper.find('SystemIssues'), { mode: 'deep' })).toMatchSnapshot();
    });

    it('should render correctly with no advisor', () => {
      const store = mockStore({
        entityDetails: {
          ...initialState.entityDetails,
          systemIssues: {
            ...initialState.entityDetails.systemIssues,
            advisor: {
              isLoaded: true,
            },
          },
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <SystemIssues isOpened />
        </Provider>
      );
      expect(toJson(wrapper.find('SystemIssues'), { mode: 'deep' })).toMatchSnapshot();
    });

    it('should render correctly with no patch', () => {
      const store = mockStore({
        entityDetails: {
          ...initialState.entityDetails,
          systemIssues: {
            ...initialState.entityDetails.systemIssues,
            patch: {
              isLoaded: true,
            },
          },
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <SystemIssues isOpened />
        </Provider>
      );
      expect(toJson(wrapper.find('SystemIssues'), { mode: 'deep' })).toMatchSnapshot();
    });

    it('should render correctly with no cve', () => {
      const store = mockStore({
        entityDetails: {
          ...initialState.entityDetails,
          systemIssues: {
            ...initialState.entityDetails.systemIssues,
            cve: {
              isLoaded: true,
            },
          },
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <SystemIssues isOpened />
        </Provider>
      );
      expect(toJson(wrapper.find('SystemIssues'), { mode: 'deep' })).toMatchSnapshot();
    });

    it('should render correctly with no compliance', () => {
      const store = mockStore({
        entityDetails: {
          ...initialState.entityDetails,
          systemIssues: {
            ...initialState.entityDetails.systemIssues,
            compliance: {
              isLoaded: true,
            },
          },
        },
      });
      const wrapper = mount(
        <Provider store={store}>
          <SystemIssues isOpened />
        </Provider>
      );
      expect(toJson(wrapper.find('SystemIssues'), { mode: 'deep' })).toMatchSnapshot();
    });
  });
});
