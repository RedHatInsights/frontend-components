import React from 'react';
import PropTypes from 'prop-types';
import {
    EmptyState,
    EmptyStateVariant,
    EmptyStateSecondaryActions,
    Button,
    Bullseye,
    Spinner,
    EmptyStateIcon,
    Title
} from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

const LoadingStep = ({ onClose, customText, cancelTitle }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__wizard-empty-state pf-u-mt-4xl">
            <EmptyStateIcon icon={ Spinner } className="pf-u-mb-0"/>
            <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
                {customText}
            </Title>
            { onClose &&
        <EmptyStateSecondaryActions className="pf-u-mt-xl">
            <Button variant="link" onClick={ onClose }>{cancelTitle}</Button>
        </EmptyStateSecondaryActions> }
        </EmptyState>
    </Bullseye>
);

LoadingStep.propTypes = {
    onClose: PropTypes.func,
    customText: PropTypes.node,
    cancelTitle: PropTypes.node
};

LoadingStep.defaultProps = {
    customText: <FormattedMessage id="wizard.loadingText" defaultMessage="Loading, please wait."/>,
    cancelTitle: <FormattedMessage id="wizard.cancelText" defaultMessage="Cancel"/>
};

export default LoadingStep;
