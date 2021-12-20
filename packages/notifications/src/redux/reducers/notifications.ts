import { PortalNotificationConfig } from '../../Portal';
import {
    ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
    CLEAR_NOTIFICATIONS
} from '../actions/action-types';

function generateID(type: string): string {
    return 'cloud-services' + type + '-' + new Date().getTime() + Math.random().toString(36).slice(2);
}

export interface AddNotificationPayload extends Omit<PortalNotificationConfig, 'id'> {
    id?: string | number;
}

const addNotification = (notifications: PortalNotificationConfig[], { payload }: { payload: AddNotificationPayload }): PortalNotificationConfig[] =>
    [ ...notifications, { id: generateID('notification'), ...payload }];

const removeNotification = (notifications: PortalNotificationConfig[], { payload }: { payload: string | number }) => {
    const index = notifications.findIndex(({ id }) => id === payload);
    return [ ...notifications.slice(0, index), ...notifications.slice(index + 1) ];
};

const clearNotifications = () => [];

export const defaultState: PortalNotificationConfig[] = [];

interface AddNotificationAction {
    type: typeof ADD_NOTIFICATION,
    payload: AddNotificationPayload
}

interface RemoveNotificationAction {
    type: typeof REMOVE_NOTIFICATION,
    payload: string | number
}

export type NotificationsReducerActions = AddNotificationAction | RemoveNotificationAction

export const notificationsReducers = (state = defaultState, action: AddNotificationAction): PortalNotificationConfig[] => {
    switch (action.type) {
        case ADD_NOTIFICATION:
            return addNotification(state, action);
        case REMOVE_NOTIFICATION:
            return removeNotification(state, action as unknown as RemoveNotificationAction);
        case CLEAR_NOTIFICATIONS:
            return clearNotifications();
        default:
            return state;
    }
};

export const notifications = notificationsReducers;
export default notifications;
