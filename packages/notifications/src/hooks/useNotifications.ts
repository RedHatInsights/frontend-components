import { useContext, useEffect, useReducer } from 'react';
import { NotificationsContext } from '../NotificationsProvider';

function useNotificationsInternal() {
  const { addNotification, removeNotification, clearNotifications, subscribe, getNotifications } = useContext(NotificationsContext);
  const [notifications, dispatch] = useReducer(() => [...getNotifications()], []);
  useEffect(() => {
    const unsubscribe = subscribe(dispatch);
    return () => {
      unsubscribe();
    };
  }, [subscribe]);
  return {
    addNotification,
    removeNotification,
    clearNotifications,
    notifications,
  };
}

export function useNotifications() {
  const notifications = useNotificationsInternal();
  return notifications;
}

export function useAddNotification() {
  const { addNotification } = useNotificationsInternal();
  return addNotification;
}

export function useRemoveNotification() {
  const { removeNotification } = useNotificationsInternal();
  return removeNotification;
}

export function useClearNotifications() {
  const { clearNotifications } = useNotificationsInternal();
  return clearNotifications;
}
