import { ErrorBoundary } from '@patternfly/react-component-groups/dist/dynamic/ErrorBoundary';

import Portal, { PortalNotificationConfig } from '../Portal';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationID } from '../state';

export interface NotificationPortalProps {
  clearNotifications?: () => void;
  silent?: boolean;
}

const NotificationPortalBase = ({ clearNotifications: propsClear, ...props }: NotificationPortalProps) => {
  const { notifications, removeNotification, clearNotifications } = useNotifications();
  const removeNotif = (id: NotificationID) => removeNotification(id);
  const onClearAll = () => clearNotifications();
  return <Portal notifications={notifications} removeNotification={removeNotif} onClearAll={propsClear || onClearAll} {...props} />;
};

export const NotificationPortal: React.FC<NotificationPortalProps> = ({ silent = true, ...props }) => {
  return (
    <ErrorBoundary headerTitle="Notifications portal" silent={silent}>
      <NotificationPortalBase {...props} />
    </ErrorBoundary>
  );
};

export default NotificationPortal;
