import React, { useState } from 'react';
import { createPortal } from 'react-dom';

import Notification from '../Notification';
import NotificationPagination from '../NotificationPagination';
import { AlertProps } from '@patternfly/react-core/dist/dynamic/components/Alert';

import './portal.scss';
import { NotificationID } from '../state';

/**
 * The single fixed-position root every Portal instance renders into by
 * default. Multiple independent consumers share one page — the shell
 * (insights-chrome) and each application mount their own Portal — and the
 * per-instance wrappers used to pin themselves to the same viewport corner,
 * covering each other. Mounting into one shared root lets the instances
 * stack in normal flow inside it instead.
 *
 * The root is found through the DOM rather than module state so that the
 * separate package copies loaded by the shell and by applications share it,
 * including version skew: updated copies join the shared stack while older
 * copies keep their previous behavior.
 */
const SHARED_ROOT_ID = 'notifications-root';

function getSharedRoot(): HTMLElement {
  const existing = document.getElementById(SHARED_ROOT_ID);
  if (existing) {
    return existing;
  }
  const root = document.createElement('div');
  root.id = SHARED_ROOT_ID;
  document.body.appendChild(root);
  return root;
}

export type PortalNotificationConfig = {
  id: NotificationID;
  title: React.ReactNode;
  variant: AlertProps['variant'];
  description?: React.ReactNode;
  dismissable?: boolean;
  autoDismiss?: boolean;
  dismissDelay?: number;
  /**
   * Action links displayed beneath the notification title and description.
   * Use PatternFly AlertActionLink components or any valid ReactNode.
   */
  actionLinks?: React.ReactNode;
};

export interface PortalProps {
  notifications?: PortalNotificationConfig[];
  removeNotification?: (id: NotificationID) => void;
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
            <Notification onDismiss={removeNotification} key={props.id} {...props} />
          ))}
        </div>,
        rootId ? document.getElementById(rootId) || document.body : getSharedRoot(),
      );
};

export default Portal;
