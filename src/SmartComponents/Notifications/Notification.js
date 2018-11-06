import React, { Component } from 'react';
import { Alert, Button } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './notifications.scss';

/**
 * Add some enter and dismiss animation later when PF has designs
 */

const DEFAULT_DELAY = 5000;

class Notification extends Component {
    constructor(props) {
        super(props);
        this.handleDismiss = this.handleDismiss.bind(this);
        if (!props.dismissable) {
            this.dismissTimeout = setTimeout(() => this.handleDismiss(), props.dismissDelay);
        }
    }

    handleDismiss() {
        this.props.onDismiss(this.props.id);
    }

    componentWillUnmount() {
        if (this.dismissTimeout) {
            clearTimeout(this.dismissTimeout);
        }
    }

    render() {
        const { description, dismissable, onDismiss, dismissDelay, ...rest } = this.props;
        return (
            <Alert
                className="notification-item"
                { ...rest }
                action={ dismissable ?
                    <Button
                        aria-label="close-notification"
                        variant="plain"
                        onClick={ this.handleDismiss }
                    >
                        <CloseIcon/>
                    </Button> : null
                }
            >
                { description }
            </Alert>
        );
    }
}

Notification.propTypes = {
    dismissable: PropTypes.bool,
    onDismiss: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    dismissDelay: PropTypes.number
};

Notification.defaultProps = {
    dismissDelay: DEFAULT_DELAY
};

export default Notification;
