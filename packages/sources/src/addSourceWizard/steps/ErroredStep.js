import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
    EmptyStateBody,
    EmptyState,
    EmptyStateIcon,
    Title,
    Button,
    EmptyStateSecondaryActions,
    EmptyStateVariant,
    Bullseye
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const ErroredStep = ({
    onClose,
    returnButtonTitle,
    message,
    title,
    customText,
    primaryAction,
    secondaryActions,
    component
}) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="pf-u-mt-4xl">
            <EmptyStateIcon icon={ ExclamationCircleIcon } color="var(--pf-global--danger-color--100)" className="pf-u-mb-0"/>
            <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
                {title}
            </Title>
            <EmptyStateBody className="ins-c-sources__wizard--step-text">
                {message || customText}
            </EmptyStateBody>
            <Button variant="primary" onClick={ primaryAction || onClose } component={component}>{returnButtonTitle}</Button>
            {secondaryActions && (
                <EmptyStateSecondaryActions>
                    {secondaryActions}
                </EmptyStateSecondaryActions>
            )}
        </EmptyState>
    </Bullseye>
);

ErroredStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    returnButtonTitle: PropTypes.node.isRequired,
    message: PropTypes.node,
    title: PropTypes.node,
    customText: PropTypes.node,
    primaryAction: PropTypes.func,
    secondaryActions: PropTypes.node,
    component: PropTypes.string
};

ErroredStep.defaultProps = {
    title: <FormattedMessage id="wizard.unsuccConfiguration" defaultMessage="Something went wrong"/>,
    // eslint-disable-next-line max-len
    customText: <FormattedMessage id="wizard.errorText" defaultMessage="There was a problem while trying to add your source. Please try again. If the error persists, open a support case."/>,
    component: 'button'
};

export default ErroredStep;
