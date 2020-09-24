import React from 'react';
import PropTypes from 'prop-types';

import {
    Title,
    Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';

import { LockIcon } from '@patternfly/react-icons';

import './NotAuthorized.scss';

const NotAuthorized = ({ serviceName, icon: Icon, description, showReturnButton, className, ...props }) => {
    return (
        <EmptyState
            variant={ EmptyStateVariant.full }
            className={`ins-c-not-authorized ${className || ''}`}
            {...props}
        >
            <EmptyStateIcon icon={ Icon } />
            <Title
                headingLevel="h5"
                size="lg"
            >
                You do not have access to { serviceName }
            </Title>
            <EmptyStateBody>
                { description }
            </EmptyStateBody>
            {
                showReturnButton && (
                    document.referrer ?
                        <Button variant="primary" onClick={ () => history.back() }>Return to previous page</Button> :
                        <Button variant="primary" component="a" href=".">Go to landing page</Button>
                )
            }
        </EmptyState>
    );
};

NotAuthorized.propTypes = {
    serviceName: PropTypes.node,
    icon: PropTypes.func,
    description: PropTypes.node,
    showReturnButton: PropTypes.bool,
    className: PropTypes.string
};

NotAuthorized.defaultProps = {
    icon: LockIcon,
    description: 'Contact your organization administrator(s) for more information.',
    showReturnButton: true
};

export default NotAuthorized;
