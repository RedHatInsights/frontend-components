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
import { CheckCircleIcon } from '@patternfly/react-icons';

const FinishedStep = ({
    onClose,
    successfulMessage,
    hideSourcesButton,
    returnButtonTitle,
    title,
    linkText,
    secondaryActions
}) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="pf-u-mt-4xl" >
            <EmptyStateIcon icon={ CheckCircleIcon } color="var(--pf-global--success-color--100)" className="pf-u-mb-0"/>
            <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
                {title}
            </Title>
            <EmptyStateBody>
                { successfulMessage }
            </EmptyStateBody>
            <Button variant="primary" onClick={ onClose } className="pf-u-mt-xl">{returnButtonTitle}</Button>
            { !hideSourcesButton && (
                <EmptyStateSecondaryActions>
                    <a href='/hybrid/settings/sources'>
                        <Button variant="link">{linkText}</Button>
                    </a>
                </EmptyStateSecondaryActions>
            ) }
            {secondaryActions && (
                <EmptyStateSecondaryActions>
                    {secondaryActions}
                </EmptyStateSecondaryActions>
            )}
        </EmptyState>
    </Bullseye>
);

FinishedStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    successfulMessage: PropTypes.node.isRequired,
    hideSourcesButton: PropTypes.bool,
    returnButtonTitle: PropTypes.node.isRequired,
    title: PropTypes.node,
    linkText: PropTypes.node,
    secondaryActions: PropTypes.node
};

FinishedStep.defaultProps = {
    title: <FormattedMessage id="wizard.succConfiguration" defaultMessage="Configuration successful"/>,
    linkText: <FormattedMessage id="wizard.toSources" defaultMessage="Take me to sources"/>
};

export default FinishedStep;
