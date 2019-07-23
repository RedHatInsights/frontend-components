import React from 'react';
import { Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';

import Form from './SourceAddModal';
import FinalWizard from './FinalWizard';

import { doCreateSource } from '../api/index';

const initialValues = {
    isSubmitted: false,
    isFinished: false,
    isErrored: false,
    values: {}
};

class AddSourceWizard extends React.Component {
    state = initialValues;

    setOnSubmitState = (values) => this.setState({
        isSubmitted: true,
        values
    })

    onSubmit = (formValues, sourceTypes) => {
        this.setOnSubmitState(formValues);
        return doCreateSource(formValues, sourceTypes).then(() => {
            this.setState({ isFinished: true });
        })
        .catch(() => {
            this.setState({ isErrored: true });
        });
    }

    afterSubmit = () => {
        const { afterSuccess, onClose } = this.props;

        onClose();
        this.setState({ ...initialValues });
        afterSuccess();
    }

    onRetry = () => this.setState({
        isErrored: false,
        isSubmitted: false
    })

    onCancel = () => {
        this.setState(initialValues);
        this.props.onClose();
    }

    render() {
        const { successfulMessage, isOpen, sourceTypes } = this.props;
        const { isErrored, isFinished, isSubmitted, values } = this.state;

        if (!isOpen) {
            return null;
        }

        if (!isSubmitted) {
            return <Form
                values={ values }
                onSubmit={ this.onSubmit }
                onCancel={ this.onCancel }
                sourceTypes={ sourceTypes }
            />;
        }

        return <FinalWizard
            afterSubmit={ this.afterSubmit }
            afterError={ this.onCancel }
            isFinished={ isFinished }
            isErrored={ isErrored }
            onRetry={ this.onRetry }
            successfulMessage={ successfulMessage }
        />;
    }
}

AddSourceWizard.propTypes = {
    afterSuccess: PropTypes.func,
    sourceTypes: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    successfulMessage: PropTypes.node
};

AddSourceWizard.defaultProps = {
    afterSuccess: () => {},
    sourceTypes: undefined,
    successfulMessage: 'Your source has been successfully added.'
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
