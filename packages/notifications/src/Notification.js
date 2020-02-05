import React, { Component } from 'react';
import { Alert, Button, TextContent, Text, TextVariants } from '@patternfly/react-core';
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
        this.setDismissTimeout();
    }

    handleDismiss = () => {
        this.props.onDismiss(this.props.id);
    }

    setDismissTimeout = () => {
        if (!this.props.dismissable) {
            this.dismissTimeout = setTimeout(() => this.handleDismiss(), this.props.dismissDelay);
        }
    }

    clearDismissTimeout = () => {
        if (this.dismissTimeout) {
            clearTimeout(this.dismissTimeout);
        }
    }

    componentWillUnmount() {
        this.clearDismissTimeout();
    }

    render() {
        const { description, dismissable, onDismiss, dismissDelay, title, sentryId, ...rest } = this.props;
        return (
            <Alert
                className="notification-item"
                title={ title && title.replace(/<\/?[^>]+(>|$)/g, '') }
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
                onMouseEnter={this.clearDismissTimeout}
                onMouseLeave={this.setDismissTimeout}
            >
                { (typeof description === 'string') ? description.replace(/<\/?[^>]+(>|$)/g, '') : description }
                {
                    sentryId && <TextContent>
                        <Text component={ TextVariants.small }>Tracking Id: { sentryId }</Text>
                    </TextContent>
                }
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
    description: PropTypes.node,
    dismissDelay: PropTypes.number,
    sentryId: PropTypes.string
};

Notification.defaultProps = {
    dismissDelay: DEFAULT_DELAY
};

export default Notification;
