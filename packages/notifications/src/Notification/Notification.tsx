import React, { useEffect, useRef, useState } from 'react';
import { Alert } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertActionCloseButton } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { AlertProps } from '@patternfly/react-core/dist/dynamic/components/Alert';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { ContentVariants } from '@patternfly/react-core/dist/dynamic/components/Content';
import './notification.scss';
import { NotificationID } from '../state';

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
  onDismiss: (id: NotificationID) => void;
  /**
   * Unique ID
   */
  id: NotificationID;
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
  /**
   * Action links displayed beneath the notification title and description.
   * Use PatternFly AlertActionLink components or any valid ReactNode.
   */
  actionLinks?: React.ReactNode;
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
  actionLinks,
  id,
  ...rest
}) => {
  const dismissTimeout = useRef<any>();
  const isHovered = useRef(false);
  // Starts optimistic so that without IntersectionObserver support (jsdom,
  // older browsers) the timer keeps its previous unconditional behavior.
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    onDismiss(id);
  };

  const clearDismissTimeout = () => {
    if (dismissTimeout.current) {
      clearTimeout(dismissTimeout.current);
    }
  };

  const setDismissTimeout = () => {
    clearDismissTimeout();
    if (autoDismiss && isVisible && !isHovered.current) {
      dismissTimeout.current = setTimeout(() => handleDismiss(), dismissDelay);
    }
  };

  /**
   * The auto-dismiss countdown runs only while the notification is actually
   * visible. Notifications clipped under the fold of the shared root are
   * reported as not intersecting, so they must not expire before the user
   * can see them: dismissing the earlier notifications reveals them, and
   * only then does their lifetime start ticking.
   */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    // PatternFly's Alert does not forward refs, so locate the rendered
    // element through the id this component puts on it.
    const element = document.getElementById(`${id}`);
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [id]);

  useEffect(() => {
    setDismissTimeout();
    return clearDismissTimeout;
  }, [isVisible]);
  return (
    <Alert
      className="notification-item"
      id={`${id}`}
      title={typeof title === 'string' ? title.replace(/<\/?[^>]+(>|$)/g, '') : title}
      {...rest}
      actionClose={dismissable ? <AlertActionCloseButton aria-label="close-notification" variant="plain" onClick={handleDismiss} /> : null}
      actionLinks={actionLinks}
      onMouseEnter={() => {
        isHovered.current = true;
        clearDismissTimeout();
      }}
      onMouseLeave={() => {
        isHovered.current = false;
        setDismissTimeout();
      }}
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
