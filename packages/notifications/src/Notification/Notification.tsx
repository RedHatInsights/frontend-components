import React, { useEffect, useRef } from 'react';
import { Alert, AlertActionCloseButton, AlertProps, Content, ContentVariants } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons';
import './notification.scss';

export interface NotificationProps {
  /**
   * Flag to automatically call `onDismiss` after `dismissDelay` runs out.
   */
  autoDismiss?: boolean;
  /**
   * Flag to show/hide notification close button.
   */
  dismissable?: boolean;
  /**
   * Function called after dismiss action is triggered. (id) => void
   */
  onDismiss: (id: number | string) => void;
  /**
   * Unique ID
   */
  id: number | string;
  /**
   * Alert variant. <a href="https://www.patternfly.org/v4/components/alert#types" target="_blank">More info.</a>
   */
  variant: AlertProps['variant'];
  /**
   * Alert title
   */
  title: React.ReactNode;
  /**
   * Alert description
   */
  description?: React.ReactNode;
  /**
   * Time period after which `onDismiss` is called.
   */
  dismissDelay?: number;
  /**
   * Unique request ID.
   */
  requestId?: string;
  /**
   * Unique sentry error ID.
   */
  sentryId?: string;
}

/**
 * Add some enter and dismiss animation later when PF has designs
 */
const DEFAULT_DELAY = 8000;

/**
 * This is a notification component used for showing toast notifications accross the platform UI.
 * Component is used with notification reducer, notification portal and notification middleware.
 * But can be also used as a standalone component.
 */
const Notification: React.ComponentType<NotificationProps> = ({
  description,
  dismissable = true,
  onDismiss,
  dismissDelay = DEFAULT_DELAY,
  title,
  sentryId,
  requestId,
  autoDismiss = true,
  id,
  ...rest
}) => {
  const dismissTimeout = useRef<any>();

  const handleDismiss = () => {
    onDismiss(id);
  };

  const setDismissTimeout = () => {
    if (autoDismiss) {
      dismissTimeout.current = setTimeout(() => handleDismiss(), dismissDelay);
    }
  };

  const clearDismissTimeout = () => {
    if (dismissTimeout.current) {
      clearTimeout(dismissTimeout.current);
    }
  };

  useEffect(() => {
    setDismissTimeout();
    return () => {
      clearDismissTimeout();
    };
  }, []);
  return (
    <Alert
      className="notification-item"
      id={`${id}`}
      title={typeof title === 'string' ? title.replace(/<\/?[^>]+(>|$)/g, '') : title}
      {...rest}
      actionClose={
        dismissable ? (
          <AlertActionCloseButton aria-label="close-notification" variant="plain" onClick={handleDismiss}>
            <CloseIcon />
          </AlertActionCloseButton>
        ) : null
      }
      onMouseEnter={clearDismissTimeout}
      onMouseLeave={setDismissTimeout}
    >
      <Content>
        <Content className="sentry-mask data-hj-suppress" component={ContentVariants.small}>
          {typeof description === 'string' ? description.replace(/<\/?[^>]+(>|$)/g, '') : description}
        </Content>
      </Content>

      {sentryId && (
        <Content>
          <Content component={ContentVariants.small}>Tracking Id: {sentryId}</Content>
        </Content>
      )}
      {requestId && (
        <Content>
          <Content component={ContentVariants.small}>Request Id: {requestId}</Content>
        </Content>
      )}
    </Alert>
  );
};

export default Notification;
