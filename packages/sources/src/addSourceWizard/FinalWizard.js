import React from 'react';
import PropTypes from 'prop-types';
import { Wizard, Button } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

import FinishedStep from './steps/FinishedStep';
import ErroredStep from './steps/ErroredStep';
import LoadingStep from './steps/LoadingStep';
import { WIZARD_DESCRIPTION, WIZARD_TITLE } from '../utilities/stringConstants';

const FinalWizard = ({
    afterSubmit,
    afterError,
    isFinished,
    isErrored,
    onRetry,
    successfulMessage,
    hideSourcesButton,
    returnButtonTitle,
    errorMessage,
    reset
}) =>(
    <Wizard
        isOpen={ true }
        onClose={ isFinished ? afterSubmit : afterError }
        title={WIZARD_TITLE}
        description={WIZARD_DESCRIPTION}
        steps={ [{
            name: 'Finish',
            component: isFinished ?
                <FinishedStep
                    onClose={ afterSubmit }
                    successfulMessage={ successfulMessage }
                    hideSourcesButton={ hideSourcesButton }
                    returnButtonTitle={ returnButtonTitle }
                    secondaryActions={<Button variant="link" onClick={ reset }><FormattedMessage id="wizard.addAnotherSource" defaultMessage="Add another source"/></Button>}
                /> :
                isErrored ?
                    <ErroredStep
                        onRetry={ onRetry }
                        onClose={ afterError }
                        returnButtonTitle={ returnButtonTitle }
                        message={errorMessage}
                    />
                    : <LoadingStep
                        customText={<FormattedMessage id="wizard.loadingText" defaultMessage="Validating source credentials"/>}
                        onClose={afterSubmit}
                        cancelTitle={<FormattedMessage id="wizard.cancel" defaultMessage="Cancel"/>}
                    />,
            isFinishedStep: true
        }] }
    />
);

FinalWizard.propTypes = {
    afterSubmit: PropTypes.func.isRequired,
    afterError: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
    isFinished: PropTypes.bool.isRequired,
    isErrored: PropTypes.bool.isRequired,
    successfulMessage: PropTypes.node.isRequired,
    hideSourcesButton: PropTypes.bool,
    returnButtonTitle: PropTypes.node.isRequired,
    errorMessage: PropTypes.node,
    reset: PropTypes.func
};

export default FinalWizard;
