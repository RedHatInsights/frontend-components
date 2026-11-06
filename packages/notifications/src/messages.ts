import { defineMessages } from '@redhat-cloud-services/frontend-components-translations/localization';

export default defineMessages({
  notificationCloseNotification: {
    description: 'Accessible name for the button that dismisses a notification.',
    id: 'notifications.notification.closeNotification',
    defaultMessage: 'close-notification',
  },
  notificationPaginationClearAll: {
    description: 'Action that dismisses all notifications from the notification list.',
    id: 'notifications.notificationPagination.clearAll',
    defaultMessage: 'Clear all',
  },
  notificationPaginationItems: {
    description: 'Plural item-type label in notification pagination controls; refers to notification messages.',
    id: 'notifications.notificationPagination.items',
    defaultMessage: 'Notifications',
  },
  notificationPortalNotificationsPortal: {
    description: 'Error-boundary heading identifying the notification portal if its content fails to render.',
    id: 'notifications.notificationPortal.notificationsPortal',
    defaultMessage: 'Notifications portal',
  },
  notificationRequestId: {
    description:
      'Request identifier displayed in a notification for troubleshooting. {id} is an opaque supplied string; preserve it exactly, including leading zeroes.',
    id: 'notifications.notification.requestId',
    defaultMessage: 'Request Id: {id}',
  },
  notificationTrackingId: {
    description:
      'Error tracking identifier displayed in a notification for support. {id} is an opaque supplied string; preserve it exactly, including leading zeroes.',
    id: 'notifications.notification.trackingId',
    defaultMessage: 'Tracking Id: {id}',
  },
});
