import { PortalNotificationConfig } from '../../Portal';
import { ADD_NOTIFICATION, CLEAR_NOTIFICATIONS, REMOVE_NOTIFICATION } from '../actions/action-types';

type AddNotification = (notifications: PortalNotificationConfig[], action: { payload: PortalNotificationConfig }) => PortalNotificationConfig[];

const addNotification: AddNotification = (notifications, { payload }) => [...notifications, payload];

type RemoveNotification = (notifications: PortalNotificationConfig[], { payload }: { payload: string | number }) => PortalNotificationConfig[];

const removeNotification: RemoveNotification = (notifications, { payload }) => {
  const index = notifications.findIndex(({ id }) => id === payload);
  return [...notifications.slice(0, index), ...notifications.slice(index + 1)];
};

const clearNotifications = () => [];

export const defaultState: PortalNotificationConfig[] = [];

interface AddNotificationAction {
  type: typeof ADD_NOTIFICATION;
  payload: PortalNotificationConfig;
}

interface RemoveNotificationAction {
  type: typeof REMOVE_NOTIFICATION;
  payload: string | number;
}
interface ClearNotificationsAction {
  type: typeof CLEAR_NOTIFICATIONS;
}

export type NotificationsReducerActions = AddNotificationAction | RemoveNotificationAction | ClearNotificationsAction;

export const notificationsReducers = (state = defaultState, action: NotificationsReducerActions): PortalNotificationConfig[] => {
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
