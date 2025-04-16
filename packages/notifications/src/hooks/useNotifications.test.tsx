import { act, renderHook } from '@testing-library/react';

import { NotificationsContext } from '../NotificationsProvider/NotificationsProvider';
import { useAddNotification, useClearNotifications, useNotifications, useRemoveNotification } from './useNotifications';
import { NotificationsStore, createStore } from '../state';

describe('useNotifications', () => {
  let store: NotificationsStore;
  beforeEach(() => {
    store = createStore();
  });

  it('should return entire notification API', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => <NotificationsContext.Provider value={store}>{children}</NotificationsContext.Provider>,
    });
    expect(result.current).toEqual({
      addNotification: expect.any(Function),
      removeNotification: expect.any(Function),
      clearNotifications: expect.any(Function),
      notifications: [],
    });
  });

  it('should add a notification', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => <NotificationsContext.Provider value={store}>{children}</NotificationsContext.Provider>,
    });

    act(() => {
      result.current.addNotification({
        title: 'Test Notification',
        description: 'desc',
        variant: 'info',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Test Notification');
    expect(result.current.notifications[0].description).toBe('desc');
  });

  it('should remove a notification', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => <NotificationsContext.Provider value={store}>{children}</NotificationsContext.Provider>,
    });

    act(() => {
      result.current.addNotification({
        title: 'Test Notification',
        description: 'desc',
        variant: 'info',
      });
    });

    expect(result.current.notifications).toHaveLength(1);

    const notificationId = result.current.notifications[0].id;
    act(() => {
      result.current.removeNotification(notificationId);
    });
    expect(result.current.notifications).toHaveLength(0);
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotifications(), {
      wrapper: ({ children }) => <NotificationsContext.Provider value={store}>{children}</NotificationsContext.Provider>,
    });

    act(() => {
      result.current.addNotification({
        title: 'Test Notification',
        description: 'desc',
        variant: 'info',
      });
      result.current.addNotification({
        title: 'Test Notification 2',
        description: 'desc',
        variant: 'info',
      });
    });

    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.clearNotifications();
    });
    expect(result.current.notifications).toHaveLength(0);
  });

  describe('should use specific store methods', () => {
    it('should use addNotification', () => {
      const { result } = renderHook(() => useAddNotification(), {
        wrapper: ({ children }) => <NotificationsContext.Provider value={store}>{children}</NotificationsContext.Provider>,
      });

      act(() => {
        result.current({
          title: 'Test Notification',
          description: 'desc',
          variant: 'info',
        });
      });
      expect(store.getNotifications()).toHaveLength(1);
      expect(store.getNotifications()[0].title).toBe('Test Notification');
      expect(store.getNotifications()[0].description).toBe('desc');
    });

    it('should use removeNotification', () => {
      const { result } = renderHook(() => useRemoveNotification(), {
        wrapper: ({ children }) => <NotificationsContext.Provider value={store}>{children}</NotificationsContext.Provider>,
      });

      act(() => {
        store.addNotification({
          title: 'Test Notification',
          description: 'desc',
          variant: 'info',
        });
      });

      expect(store.getNotifications()).toHaveLength(1);

      const notificationId = store.getNotifications()[0].id;
      act(() => {
        result.current(notificationId);
      });
      expect(store.getNotifications()).toHaveLength(0);
    });

    it('should use clearNotifications', () => {
      const { result } = renderHook(() => useClearNotifications(), {
        wrapper: ({ children }) => <NotificationsContext.Provider value={store}>{children}</NotificationsContext.Provider>,
      });

      act(() => {
        store.addNotification({
          title: 'Test Notification',
          description: 'desc',
          variant: 'info',
        });
        store.addNotification({
          title: 'Test Notification 2',
          description: 'desc',
          variant: 'info',
        });
      });

      expect(store.getNotifications()).toHaveLength(2);

      act(() => {
        result.current();
      });
      expect(store.getNotifications()).toHaveLength(0);
    });
  });
});
