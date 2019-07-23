import React from 'react';
import PropTypes from 'prop-types';

import { EmptyStateBody, EmptyState, EmptyStateIcon, Title, Button, EmptyStateSecondaryActions, EmptyStateVariant } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';

const FinishedStep = ({ onClose, successfulMessage }) => <div className="pf-l-bullseye">
    <EmptyState variant={ EmptyStateVariant.full }>
        <EmptyStateIcon icon={ CheckCircleIcon } color="var(--pf-global--success-color--100)" />
        <Title headingLevel="h5" size="lg">
      Configuration successful
        </Title>
        <EmptyStateBody>
            { successfulMessage }
        </EmptyStateBody>
        <Button variant="primary" onClick={ onClose }>Back to my application</Button>
        <EmptyStateSecondaryActions>
            <a href='/hybrid/settings/sources'>
                <Button variant="link">Take me to sources</Button>
            </a>
        </EmptyStateSecondaryActions>
    </EmptyState>
</div>;

FinishedStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    successfulMessage: PropTypes.node.isRequired
};

export default FinishedStep;
