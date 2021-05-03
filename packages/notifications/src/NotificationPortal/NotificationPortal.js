import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeNotification, clearNotifications } from '../redux/actions/notifications';
import Notification from '../Notification';
import './notificationPortal.scss';
import NotificationPagination from '../NotificationPagination';

export class Portal extends Component {
    state = {
        page: 1
    }

    onSetPage = (_event, page) => {
        this.setState({ page });
    }

    render() {
        const { page } = this.state;
        const { notifications, removeNotification, rootId, onClearAll } = this.props;
        const slicedNotifications = notifications && notifications.length <= 5 ?
            notifications :
            notifications && notifications.slice((page - 1) * 5, page * 5);
        return (!notifications || Array.isArray(notifications) && notifications.length === 0)
            ? null
            : createPortal((
                <div className="notifications-portal">
                    {
                        notifications &&
                        notifications.length > 5 &&
                        <NotificationPagination
                            onSetPage={ this.onSetPage }
                            count={ notifications.length }
                            page={ page }
                            onClearAll={ onClearAll }
                        />
                    }
                    { slicedNotifications.map(props => <Notification onDismiss={ removeNotification } key={ props.id } { ...props } />) }
                </div>
            ), document.getElementById(rootId) || document.body);
    }
};

Portal.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        variant: PropTypes.string.isRequired,
        description: PropTypes.node,
        dismissable: PropTypes.bool
    })),
    removeNotification: PropTypes.func.isRequired,
    onClearAll: PropTypes.func,
    rootId: PropTypes.string
};

const mapStateToProps = ({ notifications }, initialProps) => ({
    notifications: initialProps.notifications || notifications
});

const mapDispatchToProps = (dispatch, initialProps) => ({
    removeNotification: initialProps.removeNotification ? initialProps.removeNotification : id => dispatch(removeNotification(id)),
    onClearAll: initialProps.clearNotifications ? initialProps.clearNotifications : () => dispatch(clearNotifications())
});

export const NotificationPortal = connect(mapStateToProps, mapDispatchToProps)(Portal);

export default NotificationPortal;
