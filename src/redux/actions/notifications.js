import { ADD_NOTIFICATION, REMOVE_NOTIFICATION, CLEAR_NOTIFICATIONS } from '../action-types';

export const addNotification = notification => ({
    type: ADD_NOTIFICATION,
    payload: notification
});

export const removeNotification = index => ({
    type: REMOVE_NOTIFICATION,
    payload: index
});

export const clearNotifications = () => ({
    type: CLEAR_NOTIFICATIONS
});
