import React from 'react';
import PropTypes from 'prop-types';
import {
    EmptyState,
    EmptyStateVariant,
    EmptyStateBody,
    EmptyStateSecondaryActions,
    Button,
    Bullseye,
    Spinner,
    Progress,
    EmptyStateIcon
} from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

const LoadingStep = ({ onClose, customText, progressStep, progressTexts, cancelTitle }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state">
            <EmptyStateIcon icon={ Spinner } className="pf-u-mb-0"/>
            <EmptyStateBody className="pf-u-mt-xl">
                {progressTexts ?
                    <Progress
                        value={progressStep}
                        min={0}
                        max={progressTexts.length - 1}
                        title=" "
                        label={progressTexts[progressStep]}
                        valueText={progressTexts[progressStep]}
                        className="pf-u-mb-0 ins-c-sources__progress"
                        id="loading-progress-bar"
                    />
                    : customText
                }
            </EmptyStateBody>
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
    progressStep: PropTypes.number,
    progressTexts: PropTypes.arrayOf(PropTypes.node),
    cancelTitle: PropTypes.node
};

LoadingStep.defaultProps = {
    customText: <FormattedMessage id="wizard.loadingText" defaultMessage="Loading, please wait."/>,
    cancelTitle: <FormattedMessage id="wizard.cancelText" defaultMessage="Cancel"/>
};

export default LoadingStep;
