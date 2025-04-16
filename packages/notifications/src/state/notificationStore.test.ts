import { createStore } from './notificationStore';

describe('Notification Store', () => {
  it('should create a notification store', () => {
    const store = createStore();
    expect(store).toBeDefined();
  });

  it('should add a notification', () => {
    const store = createStore();
    store.addNotification({
      title: 'Test Notification',
      description: 'desc',
      variant: 'info',
    });
    expect(store.getNotifications()).toHaveLength(1);
    expect(store.getNotifications()[0].title).toBe('Test Notification');
    expect(store.getNotifications()[0].description).toBe('desc');
  });

  it('should remove a notification based on ID', () => {
    const store = createStore();
    store.addNotification({
      title: 'Test Notification',
      description: 'desc',
      variant: 'info',
    });
    const notificationId = store.getNotifications()[0].id;
    expect(store.getNotifications()).toHaveLength(1);
    store.removeNotification(notificationId);
    expect(store.getNotifications()).toHaveLength(0);
  });

  it('should clear all notifications', () => {
    const store = createStore();
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
    expect(store.getNotifications()).toHaveLength(2);
    store.clearNotifications();
    expect(store.getNotifications()).toHaveLength(0);
  });

  it('should subscribe to notifications', () => {
    const store = createStore();
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const unsubscribe1 = store.subscribe(callback1);
    const unsubscribe2 = store.subscribe(callback2);
    store.addNotification({
      title: 'Test Notification',
      description: 'desc',
      variant: 'info',
    });
    expect(callback1).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalled();
    unsubscribe1();
    store.addNotification({
      title: 'Test Notification 2',
      description: 'desc',
      variant: 'info',
    });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(2);
    unsubscribe2();
    store.addNotification({
      title: 'Test Notification 3',
      description: 'desc',
      variant: 'info',
    });
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(2);
  });
});
