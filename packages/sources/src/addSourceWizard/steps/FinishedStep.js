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
    Progress
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';

const FinishedStep = ({ onClose, successfulMessage, hideSourcesButton, returnButtonTitle, progressStep, progressTexts }) => <div className="pf-l-bullseye">
    <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state" >
        <EmptyStateIcon icon={ CheckCircleIcon } color="var(--pf-global--success-color--200)" className="pf-u-mb-0"/>
        <Title headingLevel="h5" size="lg" className="pf-u-mt-xl">
      Configuration successful
        </Title>
        <EmptyStateBody>
            <Progress
                className="pf-u-mb-md ins-c-sources__progress ins-c-sources__progress-success"
                value={progressStep}
                min={0}
                title=" "
                max={progressTexts.length - 1}
                label={progressTexts[progressStep]}
                valueText={progressTexts[progressStep]}
                variant="success"
            />
            { successfulMessage }
        </EmptyStateBody>
        <Button variant="primary" onClick={ onClose } className="pf-u-mt-xl">{returnButtonTitle}</Button>
        { !hideSourcesButton &&
        <EmptyStateSecondaryActions>
            <a href='/hybrid/settings/sources'>
                <Button variant="link">Take me to sources</Button>
            </a>
        </EmptyStateSecondaryActions>
        }
    </EmptyState>
</div>;

FinishedStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    successfulMessage: PropTypes.node.isRequired,
    hideSourcesButton: PropTypes.bool.isRequired,
    returnButtonTitle: PropTypes.node.isRequired,
    progressStep: PropTypes.number.isRequired,
    progressTexts: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default FinishedStep;
