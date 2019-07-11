import React from 'react';
import PropTypes from 'prop-types';

import { EmptyStateBody, EmptyState, EmptyStateIcon, Title, Button, EmptyStateSecondaryActions, EmptyStateVariant } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

const ErroredStep = ({ onClose, onRetry }) => <div className="pf-l-bullseye">
    <EmptyState variant={ EmptyStateVariant.full }>
        <EmptyStateIcon icon={ ErrorCircleOIcon } color="var(--pf-global--danger-color--100)" />
        <Title headingLevel="h5" size="lg">
      Configuration unsuccessful
        </Title>
        <EmptyStateBody>
      Something went wrong. Your source has not been successfully added.
        </EmptyStateBody>
        <Button variant="primary" onClick={ onClose }>Back to my application</Button>
        <EmptyStateSecondaryActions>
            <Button variant="link" onClick={ onRetry }>Retry</Button>
        </EmptyStateSecondaryActions>
    </EmptyState>
</div>;

ErroredStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired
};

export default ErroredStep;
