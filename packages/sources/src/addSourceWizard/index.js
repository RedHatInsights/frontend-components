import React, { useState, useReducer } from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Form from './SourceAddModal';
import FinalWizard from './FinalWizard';

import { doCreateSource } from '../api/createSource';
import { WIZARD_TITLE } from '../utilities/stringConstants';
import createProgressText from './createProgressText';
import CloseModal from './CloseModal';

const prepareInitialValues = (initialValues) => ({
    isSubmitted: false,
    isFinished: false,
    isErrored: false,
    isCancelling: false,
    values: initialValues,
    createdSource: {},
    error: undefined,
    progressStep: 0,
    progressTexts: []
});

const reducer = (state, { type, values, data, error, initialValues }) => {
    switch (type) {
        case 'reset':
            return prepareInitialValues(initialValues);
        case 'prepareSubmitState':
            return {
                ...state,
                isSubmitted: true,
                values,
                progressTexts: createProgressText(values),
                progressStep: 0
            };
        case 'increaseProgressStep':
            return { ...state, progressStep: state.progressStep + 1 };
        case 'setSubmitted':
            return { ...state, isFinished: true, createdSource: data };
        case 'setErrored':
            return { ...state, isErrored: true, error: error.toString() };
        case 'onRetry':
            return {
                ...state,
                isErrored: false,
                isSubmitted: false,
                error: undefined
            };
        case 'onStay':
            return { ...state, isCancelling: false };
        case 'showCancelModal':
            return { ...state, isCancelling: true, values };
    }
};

const AddSourceWizard = ({
    successfulMessage,
    isOpen,
    sourceTypes,
    applicationTypes,
    disableAppSelection,
    hideSourcesButton,
    returnButtonTitle,
    initialValues,
    onClose,
    afterSuccess
}) => {
    const [
        { isErrored, isFinished, isSubmitted, values, error, progressStep, progressTexts, isCancelling, createdSource },
        dispatch
    ] = useReducer(reducer, prepareInitialValues(initialValues));

    const onSubmit = (formValues, sourceTypes) => {
        dispatch({ type: 'prepareSubmitState', values: formValues });

        return doCreateSource(formValues, sourceTypes, () => dispatch({ type: 'increaseProgressStep' })).then((data) => {
            afterSuccess && afterSuccess(data);
            dispatch({ type: 'setSubmitted', data });
        })
        .catch((error) => {
            dispatch({ type: 'setErrored', error });
        });
    };

    const afterSubmit = () => {
        onClose(undefined, createdSource);
        dispatch({ type: 'reset', initialValues });
    };

    const onCancelBeforeExit = (values) => isEmpty(values)
        ? onClose({})
        : dispatch({ type: 'showCancelModal', values });

    const onExit = () => onClose(values);

    if (!isOpen) {
        return null;
    }

    if (!isSubmitted) {
        return (<React.Fragment>
            <CloseModal
                isOpen={isCancelling}
                onExit={onExit}
                onStay={() => dispatch({ type: 'onStay' })}
            />
            <Form
                isCancelling={isCancelling}
                values={ values }
                onSubmit={ onSubmit }
                onCancel={ onCancelBeforeExit }
                sourceTypes={ sourceTypes }
                applicationTypes={ applicationTypes }
                disableAppSelection={ disableAppSelection }
            />
        </React.Fragment>
        );
    }

    return <FinalWizard
        afterSubmit={ afterSubmit }
        afterError={ () => onClose({}) }
        isFinished={ isFinished }
        isErrored={ isErrored }
        onRetry={ () => dispatch({ type: 'onRetry' }) }
        successfulMessage={ successfulMessage }
        hideSourcesButton={ hideSourcesButton }
        returnButtonTitle={ returnButtonTitle }
        errorMessage={ error }
        progressStep={progressStep}
        progressTexts={progressTexts}
    />;
};

AddSourceWizard.propTypes = {
    afterSuccess: PropTypes.func,
    sourceTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        product_name: PropTypes.string.isRequired,
        schema: PropTypes.shape({
            authentication: PropTypes.array,
            endpoint: PropTypes.object
        })
    })),
    applicationTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        display_name: PropTypes.string.isRequired
    })),
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    successfulMessage: PropTypes.node,
    initialValues: PropTypes.shape({
        [PropTypes.string]: PropTypes.oneOf([ PropTypes.string, PropTypes.array, PropTypes.number, PropTypes.bool ])
    }),
    disableAppSelection: PropTypes.bool,
    hideSourcesButton: PropTypes.bool,
    returnButtonTitle: PropTypes.node
};

AddSourceWizard.defaultProps = {
    successfulMessage: 'Your source has been successfully added.',
    initialValues: {},
    returnButtonTitle: 'Go back to sources'
};

const AddSourceButton = (props) => {
    const [ isOpen, setIsOpen ] = useState(false);

    return (<React.Fragment>
        <Button variant='primary' onClick={ () => setIsOpen(true) }>{WIZARD_TITLE}</Button>
        <AddSourceWizard isOpen={ isOpen } onClose={ () => setIsOpen(false) } { ...props }/>
    </React.Fragment>);
};

export { AddSourceButton, AddSourceWizard };
