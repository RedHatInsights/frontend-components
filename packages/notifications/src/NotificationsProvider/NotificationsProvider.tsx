import { PropsWithChildren, useMemo } from 'react';
import { NotificationsStore, createStore } from '../state';
import NotificationPortal from '../NotificationPortal';
import { NotificationsContext } from './NotificationsContext';

export { NotificationsContext };

export type NotificationsProviderProps = {
  store?: NotificationsStore;
};

const NotificationsProvider = (props: PropsWithChildren<NotificationsProviderProps>) => {
  const internalStore = useMemo(() => {
    if (props.store) {
      return props.store;
    }
    return createStore();
  }, [props.store]);

  return (
    <NotificationsContext.Provider value={internalStore}>
      <NotificationPortal />
      {props.children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
