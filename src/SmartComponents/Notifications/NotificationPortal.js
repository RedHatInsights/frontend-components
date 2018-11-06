import React from 'react';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeNotification } from '../../redux/actions/notifications';
import Notification from './Notification';
import './notifications.scss';

const Portal = ({ notifications, removeNotification, rootId }) =>
    (!notifications || Array.isArray(notifications) && notifications.length === 0)
        ? null
        : createPortal((
            <div className="notifications-portal">
                {  notifications.map(props => <Notification onDismiss={ removeNotification } key={ props.id } { ...props } />) }
            </div>
        ), document.getElementById(rootId) || document.body);

Portal.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        variant: PropTypes.string.isRequired,
        description: PropTypes.string,
        dismissable: PropTypes.bool
    })),
    removeNotification: PropTypes.func.isRequired
};

const mapStateToProps = ({ notifications }, initialProps) => ({
    notifications: initialProps.notifications || notifications
});

const mapDispatchToProps = (dispatch, initialProps) => ({
    removeNotification: initialProps.removeNotification ? initialProps.removeNotification : id=> dispatch(removeNotification(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Portal);
