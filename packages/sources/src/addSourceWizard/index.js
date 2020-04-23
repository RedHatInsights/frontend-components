import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

import Form from './SourceAddModal';
import FinalWizard from './FinalWizard';

import { doCreateSource } from '../api/createSource';
import { WIZARD_TITLE } from '../utilities/stringConstants';
import createProgressText from './createProgressText';
import CloseModal from './CloseModal';

const initialValues = (initialValues) => ({
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

class AddSourceWizard extends React.Component {
    state = initialValues(this.props.initialValues);

    setOnSubmitState = (values) => this.setState({
        isSubmitted: true,
        values
    })

    onSubmit = (formValues, sourceTypes) => {
        this.setState({ progressTexts: createProgressText(formValues), progressStep: 0 });
        const increaseProgressStep = () => this.setState((({ progressStep }) => ({ progressStep: ++progressStep })));

        this.setOnSubmitState(formValues);
        return doCreateSource(formValues, sourceTypes, increaseProgressStep).then((data) => {
            this.props.afterSuccess(data);
            this.setState({ isFinished: true, createdSource: data });
        })
        .catch((error) => {
            this.setState({ isErrored: true, error: error.toString() });
        });
    }

    afterSubmit = () => {
        this.props.onClose(undefined, this.state.createdSource);
        this.setState({ ...initialValues });
    }

    onRetry = () => this.setState({
        isErrored: false,
        isSubmitted: false,
        error: undefined
    })

    onCancelBeforeExit = (values) => isEmpty(values) ? this.props.onClose({}) : this.setState({
        isCancelling: true,
        values
    });

    onExit = () => this.props.onClose(this.state.values);

    onStay = () => this.setState({
        isCancelling: false
    });

    render() {
        const {
            successfulMessage,
            isOpen,
            sourceTypes,
            applicationTypes,
            disableAppSelection,
            hideSourcesButton,
            returnButtonTitle,
            disableHardcodedSchemas
        } = this.props;
        const { isErrored, isFinished, isSubmitted, values, error, progressStep, progressTexts, isCancelling } = this.state;

        if (!isOpen) {
            return null;
        }

        if (!isSubmitted) {
            return (<React.Fragment>
                <CloseModal
                    isOpen={isCancelling}
                    onExit={this.onExit}
                    onStay={this.onStay}
                />
                <Form
                    isCancelling={isCancelling}
                    values={ values }
                    onSubmit={ this.onSubmit }
                    onCancel={ this.onCancelBeforeExit }
                    sourceTypes={ sourceTypes }
                    applicationTypes={ applicationTypes }
                    disableAppSelection={ disableAppSelection }
                    disableHardcodedSchemas={ disableHardcodedSchemas }
                />
            </React.Fragment>
            );
        }

        return <FinalWizard
            afterSubmit={ this.afterSubmit }
            afterError={ () => this.onCancel() }
            isFinished={ isFinished }
            isErrored={ isErrored }
            onRetry={ this.onRetry }
            successfulMessage={ successfulMessage }
            hideSourcesButton={ hideSourcesButton }
            returnButtonTitle={ returnButtonTitle }
            errorMessage={ error }
            progressStep={progressStep}
            progressTexts={progressTexts}
        />;
    }
}

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
    returnButtonTitle: PropTypes.node,
    disableHardcodedSchemas: PropTypes.bool
};

AddSourceWizard.defaultProps = {
    afterSuccess: () => {},
    sourceTypes: undefined,
    applicationTypes: undefined,
    successfulMessage: 'Your source has been successfully added.',
    initialValues: {},
    disableAppSelection: false,
    hideSourcesButton: false,
    returnButtonTitle: 'Go back to sources',
    disableHardcodedSchemas: false
};

class AddSourceButton extends React.Component {
    state = {
        isOpen: false
    }

    setIsOpen = (value) => this.setState({
        isOpen: value
    })

    render() {
        return <React.Fragment>
            <Button variant='primary' onClick={ () => this.setState({ isOpen: true }) }>{WIZARD_TITLE}</Button>
            <AddSourceWizard isOpen={ this.state.isOpen } onClose={ () => this.setIsOpen(false) } { ...this.props }/>
        </React.Fragment>;
    }
}

export { AddSourceButton, AddSourceWizard };
