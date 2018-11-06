export { default as NotificationsPortal } from './NotificationPortal';
export { notifications } from '../../redux/reducers/notifications';
export {
  ADD_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATIONS
} from '../../redux/action-types';
export {
  addNotification,
  removeNotification,
  clearNotifications
} from '../../redux/actions/notifications'