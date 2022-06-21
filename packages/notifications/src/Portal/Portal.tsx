import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import Notification from '../Notification';
import NotificationPagination from '../NotificationPagination';
import { AlertProps } from '@patternfly/react-core';

import './portal.scss';

export type PortalNotificationConfig = {
  id: string | number;
  title: React.ReactNode;
  variant: AlertProps['variant'];
  description?: React.ReactNode;
  dismissable?: boolean;
};

export interface PortalProps {
  notifications?: PortalNotificationConfig[];
  removeNotification?: (id: number | string) => void;
  onClearAll?: () => void;
  rootId?: string;
}

type PortalState = {
  page: number;
};

const Portal: React.ComponentType<PortalProps> = ({ notifications = [], removeNotification = () => undefined, rootId, onClearAll }) => {
  const [state, setState] = useState<PortalState>({ page: 1 });

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => {
    setState((prev) => ({ ...prev, page }));
  };

  const { page } = state;
  const slicedNotifications =
    notifications && notifications.length <= 5 ? notifications : notifications && notifications.slice((page - 1) * 5, page * 5);
  return notifications.length === 0
    ? null
    : createPortal(
        <div className="notifications-portal">
          {notifications.length > 5 && (
            <NotificationPagination onSetPage={onSetPage} count={notifications.length} page={page} onClearAll={onClearAll} />
          )}
          {slicedNotifications.map((props) => (
            <Notification onDismiss={removeNotification} key={`${props.id}`} {...props} />
          ))}
        </div>,
        rootId ? document.getElementById(rootId) || document.body : document.body
      );
};

export default Portal;
