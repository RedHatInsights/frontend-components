import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { Provider } from 'react-redux';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';
import { NotificationsPortal } from '..';
import Notification from '../Notification';
import { REMOVE_NOTIFICATION } from '../redux/actions/action-types';

describe('Notification portal', () => {
  let initialProps;
  let middlewares;
  let mockStore;
  beforeEach(() => {
    initialProps = {};
    middlewares = [];
    mockStore = configureStore(middlewares);
    initialProps = {
      store: mockStore({}),
    };
  });

  it('should return no component when no notifications given', () => {
    const t = () => {
      try {
        new ReactWrapper(
          mount(
            <Provider store={mockStore({})}>
              <NotificationsPortal {...initialProps} />
            </Provider>
          )
        );
      } catch (error) {
        throw new TypeError();
      }
    };

    expect(t).toThrow(TypeError);
  });

  it('should render notifications given from store', () => {
    const modifiedStore = mockStore({
      notifications: [
        {
          id: '0',
          variant: 'success',
          title: 'Notification title',
          description: 'Some meaningfull description',
          dismissable: true,
        },
      ],
    });
    const wrapper = mount(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} />
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render notifications given as direct props', () => {
    const wrapper = mount(
      <Provider store={mockStore({})}>
        <NotificationsPortal
          {...initialProps}
          notifications={[
            {
              id: '0',
              variant: 'success',
              title: 'Notification title',
              description: 'Some meaningfull description',
              dismissable: true,
            },
          ]}
        />
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should render notifications given as direct props over store notifications', () => {
    const modifiedStore = mockStore({
      notifications: [
        {
          id: 'store notifications',
          variant: 'success',
          title: 'Notification title',
          description: 'Some meaningfull description',
          dismissable: true,
        },
      ],
    });

    const wrapper = mount(
      <Provider store={modifiedStore}>
        <NotificationsPortal
          {...initialProps}
          notifications={[
            {
              id: 'Direct notification',
              variant: 'success',
              title: 'Notification title',
              description: 'Some meaningfull description',
              dismissable: true,
            },
          ]}
        />
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should call default removeNotification function when none given', () => {
    const modifiedStore = mockStore({
      notifications: [
        {
          id: 'store notifications',
          variant: 'success',
          title: 'Notification title',
          description: 'Some meaningfull description',
          dismissable: true,
        },
      ],
    });
    const wrapper = mount(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} />
      </Provider>
    );
    wrapper.find(Notification).find('button').simulate('click');
    expect(modifiedStore.getActions()).toEqual([
      expect.objectContaining({
        type: REMOVE_NOTIFICATION,
      }),
    ]);
  });

  it('should call custom removeNotification function', () => {
    const modifiedStore = mockStore({
      notifications: [
        {
          id: 'store notification',
          variant: 'success',
          title: 'Notification title',
          description: 'Some meaningfull description',
          dismissable: true,
        },
      ],
    });
    const dismiss = jest.fn();
    const wrapper = mount(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} removeNotification={dismiss} />
      </Provider>
    );
    wrapper.find(Notification).find('button').simulate('click');
    expect(dismiss).toHaveBeenCalledWith('store notification');
  });

  it('should render pagination', () => {
    const modifiedStore = mockStore({
      notifications: [...new Array(20)].map((_item, key) => ({
        id: `store notification ${key}`,
        variant: 'success',
        title: 'Notification title',
        description: 'Some meaningfull description',
        dismissable: true,
      })),
    });
    const clearNotifications = jest.fn();
    const wrapper = mount(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} clearNotifications={clearNotifications} />
      </Provider>
    );
    wrapper.find('.ins-c-pagination__clear-all').last().simulate('click');
    expect(clearNotifications).toHaveBeenCalled();
  });
});
