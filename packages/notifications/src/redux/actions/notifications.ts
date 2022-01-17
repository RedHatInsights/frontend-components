import { AddNotificationPayload } from '../reducers/notifications';
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, CLEAR_NOTIFICATIONS } from './action-types';

export const addNotification = (notification: AddNotificationPayload) => ({
  type: ADD_NOTIFICATION,
  payload: notification,
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
