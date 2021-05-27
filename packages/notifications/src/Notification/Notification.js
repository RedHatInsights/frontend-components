import React, { Component } from 'react';
import { Alert, TextContent, Text, TextVariants, AlertActionCloseButton } from '@patternfly/react-core';
import { CloseIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import './notification.scss';

/**
 * Add some enter and dismiss animation later when PF has designs
 */
const DEFAULT_DELAY = 8000;

/**
 * This is a notification component used for showing toast notifications accross the platform UI.
 * Component is used with notification reducer, notification portal and notification middleware.
 * But can be also used as a standalone component.
 */
export class Notification extends Component {
    constructor(props) {
        super(props);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.setDismissTimeout();
    }

    handleDismiss = () => {
        this.props.onDismiss(this.props.id);
    }

    setDismissTimeout = () => {
        if (this.props.autoDismiss) {
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
        const { description, dismissable, onDismiss, dismissDelay, title, sentryId, requestId, autoDismiss, ...rest } = this.props;
        return (
            <Alert
                className="notification-item"
                title={ title && title.replace(/<\/?[^>]+(>|$)/g, '') }
                { ...rest }
                actionClose={ dismissable ?
                    <AlertActionCloseButton
                        aria-label="close-notification"
                        variant="plain"
                        onClick={ this.handleDismiss }
                    >
                        <CloseIcon/>
                    </AlertActionCloseButton> : null
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
                {
                    requestId && <TextContent>
                        <Text component={ TextVariants.small }>Request Id: { requestId }</Text>
                    </TextContent>
                }
            </Alert>
        );
    }
}

Notification.propTypes = {
    /**
     * Flag to automatically call `onDismiss` after `dismissDelay` runs out.
     */
    autoDismiss: PropTypes.bool,
    /**
     * Flag to show/hide notification close button.
     */
    dismissable: PropTypes.bool,
    /**
     * Funcation called after dismiss action is triggered. (id) => void
     */
    onDismiss: PropTypes.func.isRequired,
    /**
     * Unique ID
     */
    id: PropTypes.string.isRequired,
    /**
     * Alert variant. <a href="https://www.patternfly.org/v4/components/alert#types" target="_blank">More info.</a>
     */
    variant: PropTypes.oneOf([ 'info', 'success', 'warning', 'danger' ]).isRequired,
    /**
     * Alert title
     */
    title: PropTypes.node.isRequired,
    /**
     * Alert description
     */
    description: PropTypes.node,
    /**
     * Time period after which `onDismiss` is called.
     */
    dismissDelay: PropTypes.number,
    /**
     * Unique request ID.
     */
    requestId: PropTypes.string,
    /**
     * Unique sentry error ID.
     */
    sentryId: PropTypes.string
};

Notification.defaultProps = {
    dismissDelay: DEFAULT_DELAY,
    autoDismiss: true,
    dismissable: true
};

export default Notification;
