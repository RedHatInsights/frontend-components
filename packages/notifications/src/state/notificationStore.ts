import { AlertProps } from '@patternfly/react-core/dist/dynamic/components/Alert';

export type NotificationID = ReturnType<typeof window.crypto.randomUUID>;

export type NotificationConfig = {
  id: NotificationID;
  title: React.ReactNode;
  variant: AlertProps['variant'];
  description?: React.ReactNode;
  dismissable?: boolean;
  autoDismiss?: boolean;
  dismissDelay?: number;
};

type AddNotification = (config: Omit<NotificationConfig, 'id'>) => void;

export type NotificationsStore = {
  addNotification: AddNotification;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  subscribe: (callback: () => void) => () => void;
  getNotifications: () => NotificationConfig[];
};

export function createStore() {
  const notifications: NotificationConfig[] = [];
  const subscriptions = new Map<NotificationID, () => void>();
  const store = {
    notifications,
  };
  const removeNotification = (id: NotificationID) => {
    const index = notifications.findIndex((notification) => notification.id === id);
    if (index !== -1) {
      store.notifications.splice(index, 1);
    }
  };
  const clearNotifications = () => {
    store.notifications = [];
  };
  const subscribe = (callback: () => void) => {
    const id = window.crypto.randomUUID();
    subscriptions.set(id, callback);
    return () => {
      subscriptions.delete(id);
    };
  };

  const notify = () => {
    subscriptions.forEach((callback) => callback());
  };

  const wrapNotify = (...fns: ((...args: any[]) => void)[]) =>
    fns.map((fn) => {
      const wrapped = (...args: any[]) => {
        fn(...args);
        notify();
      };
      return wrapped;
    });

  function addNotification(config: Omit<NotificationConfig, 'id'>) {
    const id = window.crypto.randomUUID();
    store.notifications.push({ ...config, id });
  }
  const [wrappedAdd, wrappedRemove, wrappedClear] = wrapNotify(addNotification, removeNotification, clearNotifications);
  const wrappedStore: NotificationsStore = {
    addNotification: wrappedAdd,
    removeNotification: wrappedRemove,
    clearNotifications: wrappedClear,
    subscribe,
    getNotifications() {
      return store.notifications;
    },
  };
  return wrappedStore;
}
