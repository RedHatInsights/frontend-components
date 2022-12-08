import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Portal, { PortalNotificationConfig } from '../Portal';
import { clearNotifications, removeNotification } from '../redux/actions/notifications';
import { ErrorBoundary } from '@redhat-cloud-services/frontend-components/ErrorBoundary';

export interface NotificationsState {
  notifications?: PortalNotificationConfig[];
}

export interface NotificationPortalProps {
  clearNotifications?: () => void;
  silent?: boolean;
}

export const NotificationPortalBase: React.FC<NotificationPortalProps> = ({ clearNotifications: propsClear, ...props }) => {
  const notifications = useSelector<NotificationsState>(({ notifications }) => notifications);
  const dispatch = useDispatch();
  const removeNotif = (id: number | string) => dispatch(removeNotification(id));
  const onClearAll = () => dispatch(clearNotifications());
  return (
    <Portal
      notifications={notifications as PortalNotificationConfig[]}
      removeNotification={removeNotif}
      onClearAll={propsClear || onClearAll}
      {...props}
    />
  );
};

export const NotificationPortal: React.FC<NotificationPortalProps> = ({ silent = true, ...props }) => (
  <ErrorBoundary headerTitle="Notifications portal" silent={silent}>
    <NotificationPortalBase {...props} />
  </ErrorBoundary>
);

export { default as Portal } from '../Portal';

export default NotificationPortal;
