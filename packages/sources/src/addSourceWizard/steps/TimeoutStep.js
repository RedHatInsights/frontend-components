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
import { WrenchIcon } from '@patternfly/react-icons';

const TimeoutStep = ({
    onClose,
    returnButtonTitle,
    title,
    secondaryActions
}) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="pf-u-mt-4xl" >
            <EmptyStateIcon icon={ WrenchIcon } color="var(--pf-global--Color--200)" className="pf-u-mb-0"/>
            <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
                {title}
            </Title>
            <EmptyStateBody>
                <FormattedMessage
                    id="wizard.uncompleteConfigurationDescription"
                    defaultMessage="We are still working to confirm credentials and app settings.{newLine}To track progress, check the Status column in the Sources table."
                    values={{ newLine: <br /> }}
                />
            </EmptyStateBody>
            <Button variant="primary" onClick={ onClose } className="pf-u-mt-xl">{returnButtonTitle}</Button>
            {secondaryActions && (
                <EmptyStateSecondaryActions>
                    {secondaryActions}
                </EmptyStateSecondaryActions>
            )}
        </EmptyState>
    </Bullseye>
);

TimeoutStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    returnButtonTitle: PropTypes.node.isRequired,
    title: PropTypes.node,
    secondaryActions: PropTypes.node
};

TimeoutStep.defaultProps = {
    title: <FormattedMessage id="wizard.uncompleteConfigurationTitle" defaultMessage="Configuration not yet complete"/>
};

export default TimeoutStep;
