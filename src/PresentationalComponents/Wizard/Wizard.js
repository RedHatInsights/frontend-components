import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Modal, Button } from '@patternfly/react-core';

import './wizard.scss';

class Wizard extends Component {

    constructor () {
        super();
        this.state = {
            currentStep: 0
        };
        this.handlePreviousModalStep = this.handlePreviousModalStep.bind(this);
        this.handleNextModalStep = this.handleNextModalStep.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
    };

    handleNextModalStep() {
        this.setState(({ currentStep }) => ({
            currentStep: currentStep + 1
        }));
    }

    handlePreviousModalStep() {
        this.setState(({ currentStep }) => ({
            currentStep: currentStep - 1
        }));
    }

    // On modal close, reset currentStep back to the initial step, the call modalToggle(PF)
    handleOnClose(submit = false) {
        const result = this.props.onClose(submit);

        if (result === false) {
            return;
        }

        this.setState({ currentStep: 0 });
    }

    render() {

        const { isLarge, title, className, isOpen, ...props } = this.props;

        const wizardClasses = classNames(
            'ins-c-wizard',
            className
        );

        const renderModalActions =  [
            <Button key="cancel" variant="secondary" onClick={ () => this.handleOnClose(false) }>
            Cancel
            </Button>,
            // Conditionally render 'previous' button if not on first page
            this.state.currentStep !== 0 &&
                <Button key="back" variant="secondary" onClick={ this.handlePreviousModalStep }> Back </Button>,
            // Conditionally render 'confirm' button if on last page
            this.state.currentStep < this.props.content.length - 1
                ? <Button key="Next" variant="primary" onClick={ this.handleNextModalStep }> Next </Button>
                : <Button key="confirm" variant="primary" onClick={ () => this.handleOnClose(true) }> Confirm </Button>
        ];

        return (
            <Modal
                { ...props }
                isLarge = { isLarge }
                title= { title }
                className= { wizardClasses }
                isOpen={ isOpen }
                onClose={ () => this.handleOnClose(false) }
                actions={ renderModalActions }>
                { this.props.content[this.state.currentStep] }
            </Modal>
        );
    }
}

Wizard.propTypes = {
    isLarge: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string,
    isOpen: PropTypes.any,
    content: PropTypes.array,
    onClose: PropTypes.func
};

Wizard.defaultProps = {
    onClose: f => f
};

export default Wizard;
