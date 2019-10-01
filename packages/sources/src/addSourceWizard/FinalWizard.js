import React from 'react';
import PropTypes from 'prop-types';
import { Wizard } from '@patternfly/react-core';

import FinishedStep from './steps/FinishedStep';
import ErroredStep from './steps/ErroredStep';
import LoadingStep from './steps/LoadingStep';

const FinalWizard = ({ afterSubmit, afterError, isFinished, isErrored, onRetry, successfulMessage, hideSourcesButton, returnButtonTitle }) =>
    <Wizard
        isOpen={ true }
        onClose={ isFinished ? afterSubmit : afterError }
        title="Add a source"
        description="Connect an external source to Red Hat Cloud Services"
        steps={ [{
            name: 'Finish',
            component: isFinished ?
                <FinishedStep
                    onClose={ afterSubmit }
                    successfulMessage={ successfulMessage }
                    hideSourcesButton={ hideSourcesButton }
                    returnButtonTitle={ returnButtonTitle }
                /> :
                isErrored ?
                    <ErroredStep onRetry={ onRetry } onClose={ afterError } returnButtonTitle={ returnButtonTitle }/>
                    : <LoadingStep customText='Source is being created'/>,
            isFinishedStep: true
        }] } />;

FinalWizard.propTypes = {
    afterSubmit: PropTypes.func.isRequired,
    afterError: PropTypes.func.isRequired,
    onRetry: PropTypes.func.isRequired,
    isFinished: PropTypes.bool.isRequired,
    isErrored: PropTypes.bool.isRequired,
    successfulMessage: PropTypes.node.isRequired,
    hideSourcesButton: PropTypes.bool.isRequired,
    returnButtonTitle: PropTypes.node.isRequired
};

export default FinalWizard;
