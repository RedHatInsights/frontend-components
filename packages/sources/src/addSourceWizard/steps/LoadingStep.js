import React from 'react';
import PropTypes from 'prop-types';
import { EmptyState, EmptyStateVariant, EmptyStateBody, EmptyStateSecondaryActions, Button } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

const LoadingStep = ({ onClose, customText }) => <div className="pf-l-bullseye">
    <EmptyState variant={ EmptyStateVariant.full }>
        <div>
            <Spinner />
        </div>
        <EmptyStateBody>
            { customText }
        </EmptyStateBody>
        { onClose &&
        <EmptyStateSecondaryActions>
            <Button variant="link" onClick={ onClose }>Cancel</Button>
        </EmptyStateSecondaryActions> }
    </EmptyState>
</div>;

LoadingStep.propTypes = {
    onClose: PropTypes.func,
    customText: PropTypes.string
};

LoadingStep.defaultProps = {
    customText: 'Loading, please wait.'
};

export default LoadingStep;
