import { createContext } from 'react';
import { NotificationsStore } from '../state';

export const NotificationsContext = createContext<NotificationsStore>({
  addNotification: () => undefined,
  removeNotification: () => undefined,
  clearNotifications: () => undefined,
  subscribe: () => () => undefined,
  getNotifications() {
    return [];
  },
});
