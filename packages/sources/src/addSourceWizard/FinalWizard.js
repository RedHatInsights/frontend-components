import React from 'react';
import PropTypes from 'prop-types';
import { Wizard } from '@patternfly/react-core';

import FinishedStep from './steps/FinishedStep';
import ErroredStep from './steps/ErroredStep';
import LoadingStep from './steps/LoadingStep';

const FinalWizard = ({ afterSubmit, afterError, isFinished, isErrored, onRetry, successfulMessage, hideSourcesButton }) =>
    <Wizard
        isOpen={ true }
        onClose={ isFinished ? afterSubmit : afterError }
        title="Add a source"
        description="You are importing data into this platform"
        steps={ [{
            name: 'Finish',
            component: isFinished ?
                <FinishedStep onClose={ afterSubmit } successfulMessage={ successfulMessage } hideSourcesButton={ hideSourcesButton }/> :
                isErrored ?
                    <ErroredStep onRetry={ onRetry } onClose={ afterError }/>
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
    hideSourcesButton: PropTypes.bool.isRequired
};

export default FinalWizard;
