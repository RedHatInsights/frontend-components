import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateVariant, EmptyStateBody, EmptyStateSecondaryActions, Button, Bullseye, Spinner } from '@patternfly/react-core';

const LoadingStep = ({ onClose, customText }) => <Bullseye>
    <EmptyState variant={ EmptyStateVariant.full }>
        <Spinner />
        <EmptyStateBody>
            { customText }
        </EmptyStateBody>
        { onClose &&
        <EmptyStateSecondaryActions>
            <Button variant="link" onClick={ onClose }>Cancel</Button>
        </EmptyStateSecondaryActions> }
    </EmptyState>
</Bullseye>;

LoadingStep.propTypes = {
    onClose: PropTypes.func,
    customText: PropTypes.string
};

LoadingStep.defaultProps = {
    customText: 'Loading, please wait.'
};

export default LoadingStep;
