import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import Form from './SourceAddModal';
import FinalWizard from './FinalWizard';

import { doCreateSource } from '../api/createSource';

const initialValues = (initialValues) => ({
    isSubmitted: false,
    isFinished: false,
    isErrored: false,
    values: initialValues,
    createdSource: {},
    error: undefined
});

class AddSourceWizard extends React.Component {
    state = initialValues(this.props.initialValues);

    setOnSubmitState = (values) => this.setState({
        isSubmitted: true,
        values
    })

    onSubmit = (formValues, sourceTypes) => {
        this.setOnSubmitState(formValues);
        return doCreateSource(formValues, sourceTypes).then((data) => {
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

    onCancel = (formValues) => {
        this.setState(initialValues);
        this.props.onClose(formValues);
    }

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
        const { isErrored, isFinished, isSubmitted, values, error } = this.state;

        if (!isOpen) {
            return null;
        }

        if (!isSubmitted) {
            return <Form
                values={ values }
                onSubmit={ this.onSubmit }
                onCancel={ this.onCancel }
                sourceTypes={ sourceTypes }
                applicationTypes={ applicationTypes }
                disableAppSelection={ disableAppSelection }
                disableHardcodedSchemas={ disableHardcodedSchemas }
            />;
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
            <Button variant='primary' onClick={ () => this.setState({ isOpen: true }) }>Add a source</Button>
            <AddSourceWizard isOpen={ this.state.isOpen } onClose={ () => this.setIsOpen(false) } { ...this.props }/>
        </React.Fragment>;
    }
}

export { AddSourceButton, AddSourceWizard };
