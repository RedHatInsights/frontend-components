import { PortalNotificationConfig } from '../../Portal';
import { ADD_NOTIFICATION, CLEAR_NOTIFICATIONS, REMOVE_NOTIFICATION } from './action-types';

function generateID(type: string): string {
  return 'cloud-services' + type + '-' + new Date().getTime() + Math.random().toString(36).slice(2);
}

export type AddNotificationPayload = Omit<PortalNotificationConfig, 'id'> & { id?: string | number };

export const addNotification = (notification: AddNotificationPayload) => ({
  type: ADD_NOTIFICATION,
  payload: {
    id: generateID('notification'),
    ...notification,
  },
});

export const removeNotification = (index: string | number) => ({
  type: REMOVE_NOTIFICATION,
  payload: index,
});

export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});

export default {
  addNotification,
  removeNotification,
  clearNotifications,
};
