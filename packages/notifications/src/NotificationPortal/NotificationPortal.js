import { connect } from 'react-redux';
import Portal from '../Portal';
import { removeNotification, clearNotifications } from '../redux/actions/notifications';

const mapStateToProps = ({ notifications }, initialProps) => ({
    notifications: initialProps.notifications || notifications
});

const mapDispatchToProps = (dispatch, initialProps) => ({
    removeNotification: initialProps.removeNotification ? initialProps.removeNotification : id => dispatch(removeNotification(id)),
    onClearAll: initialProps.clearNotifications ? initialProps.clearNotifications : () => dispatch(clearNotifications())
});

export const NotificationPortal = connect(mapStateToProps, mapDispatchToProps)(Portal);

export { default as Portal } from '../Portal';

export default NotificationPortal;
