import { connect } from 'react-redux';
import { Dispatch, ActionCreator } from 'redux';
import Portal, { PortalNotificationConfig } from '../Portal';
import { removeNotification, clearNotifications } from '../redux/actions/notifications';

export interface NotificationsState {
    [key: string]: any,
    notifications?: PortalNotificationConfig[]
}

export interface NotificationPortalProps {
    removeNotification: ActionCreator<PortalNotificationConfig>,
    clearNotifications: ActionCreator<Record<string, unknown>>,
}

const mapStateToProps = ({ notifications }: NotificationsState, initialProps: NotificationsState) => ({
    notifications: initialProps.notifications || notifications
});

const mapDispatchToProps = (dispatch: Dispatch, initialProps: NotificationPortalProps) => ({
    removeNotification: initialProps.removeNotification
        ? initialProps.removeNotification
        : (id: number | string) => dispatch(removeNotification(id)),
    onClearAll: initialProps.clearNotifications ? initialProps.clearNotifications : () => dispatch(clearNotifications())
});

export const NotificationPortal = connect<NotificationsState>(mapStateToProps, mapDispatchToProps)(Portal);

export { default as Portal } from '../Portal';

export default NotificationPortal;
