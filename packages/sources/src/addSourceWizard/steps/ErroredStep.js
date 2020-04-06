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
    TextVariants,
    Progress,
    Bullseye
} from '@patternfly/react-core';
import { TimesCircleIcon } from '@patternfly/react-icons';

const ErroredStep = ({ onClose, onRetry, returnButtonTitle, message, progressStep, progressTexts }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state">
            <EmptyStateIcon icon={ TimesCircleIcon } color="var(--pf-global--danger-color--100)" />
            <Title headingLevel="h5" size="lg">
      Configuration unsuccessful
            </Title>
            <EmptyStateBody>
                <Progress
                    className="pf-u-mb-md"
                    value={progressStep}
                    min={0}
                    title=" "
                    max={progressTexts.length - 1}
                    label={progressTexts[progressStep]}
                    valueText={progressTexts[progressStep]}
                    variant='danger'
                />
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
    </Bullseye>
);

ErroredStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
    returnButtonTitle: PropTypes.node.isRequired,
    message: PropTypes.node,
    progressStep: PropTypes.number.isRequired,
    progressTexts: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ErroredStep;
