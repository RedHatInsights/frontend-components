import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Wizard, Button, Text } from '@patternfly/react-core';
import { useIntl } from 'react-intl';

import FinishedStep from './steps/FinishedStep';
import ErroredStep from './steps/ErroredStep';
import LoadingStep from './steps/LoadingStep';
import TimeoutStep from './steps/TimeoutStep';
import AmazonFinishedStep from './steps/AmazonFinishedStep';

import { WIZARD_DESCRIPTION, WIZARD_TITLE } from '../utilities/stringConstants';
import { getSourcesApi } from '../api';
import computeSourceStatus from '../utilities/computeSourceStatus';
import EditLink from './EditLink';

const FinalWizard = ({
    afterSubmit,
    afterError,
    isFinished,
    isErrored,
    successfulMessage,
    hideSourcesButton,
    returnButtonTitle,
    reset,
    createdSource = {},
    tryAgain,
    afterSuccess,
    sourceTypes
}) => {
    const [ isDeletingSource, setIsDeleting ] = useState();
    const [ isAfterDeletion, setDeleted ] = useState();

    const intl = useIntl();

    const removeSource = () => {
        setIsDeleting(true);

        return getSourcesApi().removeSource(createdSource.id)
        .then(() => {
            afterSuccess && afterSuccess();
            setDeleted(true);
        })
        .catch(() => setIsDeleting(false));
    };

    const addAnotherSourceButton = <Button variant="link" onClick={ reset }>{ intl.formatMessage({
        id: 'wizard.addAnotherSource',
        defaultMessage: 'Add another source'
    }) }</Button>;

    let step;
    if (isAfterDeletion) {
        step = <FinishedStep
            onClose={ afterSubmit }
            title={ intl.formatMessage({ id: 'wizard.removeSourceSuccessTitle', defaultMessage: 'Removing successful' }) }
            successfulMessage={ intl.formatMessage({ id: 'wizard.removeSourceSuccessDescription', defaultMessage: 'Source was successfully removed.' }) }
            hideSourcesButton={ hideSourcesButton }
            returnButtonTitle={ returnButtonTitle }
            secondaryActions={ addAnotherSourceButton }
        />;
    } else if (isDeletingSource) {
        step = <LoadingStep
            customText={intl.formatMessage({
                id: 'wizard.removingSource',
                defaultMessage: 'Removing source'
            })}
        />;
    } else if (isFinished) {
        switch (computeSourceStatus(createdSource)) {
            case 'unavailable':
                step = <ErroredStep
                    onClose={ afterSubmit }
                    secondaryActions={<Button variant="link" onClick={ removeSource }>
                        {intl.formatMessage({ id: 'wizard.removeSource', defaultMessage: 'Remove source' })}
                    </Button>}
                    Component={() => <EditLink id={createdSource.id} />}
                    message={
                        createdSource.applications?.[0]?.availability_status_error
                        || createdSource.endpoint?.[0]?.availability_status_error
                        || intl.formatMessage({ id: 'wizard.unknownError', defaultMessage: 'Unknown error' })
                    }
                    title={intl.formatMessage({ id: 'wizard.configurationUnsuccessful', defaultMessage: 'Configuration unsuccessful' })}
                />;
                break;
            case 'timeout':
                step = <TimeoutStep
                    onClose={ afterSubmit }
                    returnButtonTitle={ returnButtonTitle }
                    secondaryActions={ addAnotherSourceButton }
                />;
                break;
            default:
                if (createdSource.source_type_id === sourceTypes.find(({ name }) => name === 'amazon')?.id) {
                    step = <AmazonFinishedStep onClose={ afterSubmit } />;
                } else {
                    step = <FinishedStep
                        onClose={ afterSubmit }
                        successfulMessage={ successfulMessage }
                        hideSourcesButton={ hideSourcesButton }
                        returnButtonTitle={ returnButtonTitle }
                        secondaryActions={ addAnotherSourceButton }
                    />;
                }

                break;
        }
    } else if (isErrored) {
        step = <ErroredStep
            onClose={ afterError }
            primaryAction={tryAgain}
            secondaryActions={
                <Text
                    component='a'
                    target="_blank"
                    href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
                    rel="noopener noreferrer"
                >
                    {intl.formatMessage({ id: 'wizard.openTicket', defaultMessage: 'Open a support case' })}
                </Text>
            }
            returnButtonTitle={ intl.formatMessage({
                id: 'wizard.retryText',
                defaultMessage: 'Retry'
            })}
        />;
    } else {
        step = <LoadingStep
            customText={intl.formatMessage({
                id: 'wizard.loadingText',
                defaultMessage: 'Validating source credentials'
            })}
            onClose={afterError}
            cancelTitle={intl.formatMessage({ id: 'wizard.close', defaultMessage: 'Close' })}
        />;
    }

    return (
        <Wizard
            isOpen={ true }
            onClose={ isFinished ? afterSubmit : afterError }
            title={WIZARD_TITLE()}
            description={WIZARD_DESCRIPTION()}
            steps={ [{
                name: 'Finish',
                component: step,
                isFinishedStep: true
            }] }
        />
    );};

FinalWizard.propTypes = {
    afterSubmit: PropTypes.func.isRequired,
    afterError: PropTypes.func.isRequired,
    isFinished: PropTypes.bool.isRequired,
    isErrored: PropTypes.bool.isRequired,
    successfulMessage: PropTypes.node.isRequired,
    hideSourcesButton: PropTypes.bool,
    returnButtonTitle: PropTypes.node.isRequired,
    errorMessage: PropTypes.node,
    reset: PropTypes.func,
    createdSource: PropTypes.object,
    tryAgain: PropTypes.func,
    afterSuccess: PropTypes.func,
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }))
};

export default FinalWizard;
