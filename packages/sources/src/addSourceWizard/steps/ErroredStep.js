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

const ErroredStep = ({
    onClose,
    onRetry,
    returnButtonTitle,
    message,
    progressStep,
    progressTexts,
    title,
    customText,
    retryText
}) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state">
            <EmptyStateIcon icon={ TimesCircleIcon } color="var(--pf-global--danger-color--100)" className="pf-u-mb-0"/>
            <Title headingLevel="h5" size="lg" className="pf-u-mt-xl">
                {title}
            </Title>
            <EmptyStateBody>
                <Progress
                    className="pf-u-mb-md ins-c-sources__progress"
                    value={progressStep}
                    min={0}
                    title=" "
                    max={progressTexts.length - 1}
                    label={progressTexts[progressStep]}
                    valueText={progressTexts[progressStep]}
                    variant='danger'
                />
                <TextContent>
                    <Text variant={TextVariants.p}>{customText}</Text>
                    { message && <Text className="pf-u-mt-md" variant={TextVariants.p}>{message}</Text>}
                </TextContent>
            </EmptyStateBody>
            <Button variant="primary" onClick={ onClose }>{returnButtonTitle}</Button>
            <EmptyStateSecondaryActions>
                <Button variant="link" onClick={ onRetry }>{retryText}</Button>
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
    progressTexts: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.node,
    customText: PropTypes.node,
    retryText: PropTypes.node
};

ErroredStep.defaultProps = {
    title: 'Configuration unsuccessful',
    customText: 'Your source has not been successfully added:',
    retryText: 'Retry'
};

export default ErroredStep;
