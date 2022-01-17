import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Modal, Button } from '@patternfly/react-core';

import './wizard.scss';

class Wizard extends Component {
  state = {
    currentStep: 0,
  };

  handleNextModalStep = () => {
    this.setState(({ currentStep }) => ({
      currentStep: currentStep + 1,
    }));
  };

  handlePreviousModalStep = () => {
    this.setState(({ currentStep }) => ({
      currentStep: currentStep - 1,
    }));
  };

  // On modal close, reset currentStep back to the initial step, the call modalToggle(PF)
  handleOnClose = (submit) => {
    const result = this.props.onClose(submit);

    if (result === false) {
      return;
    }

    this.setState({ currentStep: 0 });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter' && this.props.isValidated === true) {
      this.handleNextModalStep();
    }
  };

  render() {
    const { isLarge, title, className, isOpen, isValidated, confirmAction, ...props } = this.props;

    const wizardClasses = classNames('ins-c-wizard', className);

    const renderModalActions = [
      // Conditionally render 'confirm' button if on last page
      this.state.currentStep < this.props.content.length - 1 ? (
        <Button key="Next" action="next" variant="primary" isDisabled={!isValidated} onClick={this.handleNextModalStep}>
          Next
        </Button>
      ) : (
        <Button key="confirm" action="confirm" variant="primary" isDisabled={!isValidated} onClick={() => this.handleOnClose(true)}>
          {confirmAction}
        </Button>
      ),
      // Conditionally render 'previous' button if not on first page
      this.state.currentStep !== 0 && (
        <Button key="back" action="back" variant="secondary" onClick={this.handlePreviousModalStep}>
          {' '}
          Back{' '}
        </Button>
      ),
      <Button key="cancel" action="cancel" variant="secondary" onClick={() => this.handleOnClose(false)}>
        Cancel
      </Button>,
    ];

    return (
      <Modal
        {...props}
        onKeyPress={this.handleKeyPress}
        variant="large"
        title={title}
        className={wizardClasses}
        isOpen={isOpen}
        onClose={() => this.handleOnClose(false)}
        actions={renderModalActions}
      >
        {this.props.content[this.state.currentStep]}
      </Modal>
    );
  }
}

Wizard.propTypes = {
  isValidated: PropTypes.bool,
  isLarge: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  confirmAction: PropTypes.string,
  isOpen: PropTypes.any,
  content: PropTypes.array,
  onClose: PropTypes.func,
};

Wizard.defaultProps = {
  onClose: (f) => f,
  isValidated: true,
  confirmAction: 'Confirm',
};

export default Wizard;
