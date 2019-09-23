import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './tagModal.scss';
import { Modal } from '@patternfly/react-core';

export default class TagModal extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Modal
            width={'50%'}
            title="Modal Header"
            isOpen={this.props.modalOpen}
            onClose={this.handleModalToggle}
            isFooterLeftAligned
            >
                Test
            </Modal>
        )
    }
}