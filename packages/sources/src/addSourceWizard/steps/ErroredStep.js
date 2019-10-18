import React from 'react';
import PropTypes from 'prop-types';

import {
    EmptyStateBody,
    EmptyState,
    EmptyStateIcon,
    Title,
    Button,
    EmptyStateSecondaryActions,
    EmptyStateVariant,
    TextContent,
    Text,
    TextVariants
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

const ErroredStep = ({ onClose, onRetry, returnButtonTitle, message }) => <div className="pf-l-bullseye">
    <EmptyState variant={ EmptyStateVariant.full }>
        <EmptyStateIcon icon={ ErrorCircleOIcon } color="var(--pf-global--danger-color--100)" />
        <Title headingLevel="h5" size="lg">
      Configuration unsuccessful
        </Title>
        <EmptyStateBody>
            <TextContent>
                <Text variant={TextVariants.p}>Your source has not been successfully added:</Text>
                { message && <Text variant={TextVariants.p}>{message}</Text>}
            </TextContent>
        </EmptyStateBody>
        <Button variant="primary" onClick={ onClose }>{returnButtonTitle}</Button>
        <EmptyStateSecondaryActions>
            <Button variant="link" onClick={ onRetry }>Retry</Button>
        </EmptyStateSecondaryActions>
    </EmptyState>
</div>;

ErroredStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
    returnButtonTitle: PropTypes.node.isRequired,
    message: PropTypes.node
};

export default ErroredStep;
