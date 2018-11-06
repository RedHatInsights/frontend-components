import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
    CLEAR_NOTIFICATIONS
} from '../../action-types';
import { generateID } from '../../../functions/generateID';

const addNotification = (notifications, { payload }) => [ ...notifications, { ...payload, id: generateID('notyfication') }];
const removeNotification = (notifications, { payload }) => {
    const index = notifications.findIndex(({ id }) => id === payload);
    return [ ...notifications.slice(0, index), ...notifications.slice(index + 1) ];
};

const clearNotifications = () => [];

export const defaultState = [];

export default {
    [ADD_NOTIFICATION]: addNotification,
    [REMOVE_NOTIFICATION]: removeNotification,
    [CLEAR_NOTIFICATIONS]: clearNotifications
};
