import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import NotificationsPortal from './NotificationPortal';
import { REMOVE_NOTIFICATION } from '../redux/actions/action-types';
import { render } from '@testing-library/react';

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
    render(
      <Provider store={mockStore({})}>
        <NotificationsPortal {...initialProps} />
      </Provider>,
      {
        container: document.body,
      },
    );
    expect(document.body.innerHTML).toBe('');
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
    const { container } = render(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} />
      </Provider>,
      {
        container: document.body,
      },
    );
    expect(container).toMatchSnapshot();
  });

  it('should render notifications given as direct props', () => {
    const { container } = render(
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
      </Provider>,
      {
        container: document.body,
      },
    );
    expect(container).toMatchSnapshot();
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

    const { container } = render(
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
      </Provider>,
      {
        container: document.body,
      },
    );
    expect(container).toMatchSnapshot();
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
    const { container } = render(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} />
      </Provider>,
      {
        container: document.body,
      },
    );
    container.querySelector('button').click();
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
    const { container } = render(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} removeNotification={dismiss} />
      </Provider>,
      {
        container: document.body,
      },
    );
    container.querySelector('button').click();
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
    const { container } = render(
      <Provider store={modifiedStore}>
        <NotificationsPortal {...initialProps} clearNotifications={clearNotifications} />
      </Provider>,
      {
        container: document.body,
      },
    );
    const paginationItems = container.querySelectorAll('.ins-c-pagination__clear-all');
    paginationItems[paginationItems.length - 1].click();
    expect(clearNotifications).toHaveBeenCalled();
  });
});
