import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
    CLEAR_NOTIFICATIONS
} from '../actions/action-types';

function generateID(type) {
    let text = 'cloud-services' + type + '-' + new Date().getTime() + Math.random().toString(36).slice(2);
    return text;
}

const addNotification = (notifications, { payload }) => [ ...notifications, { ...payload, id: generateID('notyfication') }];
const removeNotification = (notifications, { payload }) => {
    const index = notifications.findIndex(({ id }) => id === payload);
    return [ ...notifications.slice(0, index), ...notifications.slice(index + 1) ];
};

const clearNotifications = () => [];

export const defaultState = [];

export const notificationsReducers = (state = defaultState, action) => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return addNotification(state, action);
        case REMOVE_NOTIFICATION:
            return removeNotification(state, action);
        case CLEAR_NOTIFICATIONS:
            return clearNotifications(state, action);
        default:
            return state;
    }
};

export const notifications = notificationsReducers;
export default notifications;
