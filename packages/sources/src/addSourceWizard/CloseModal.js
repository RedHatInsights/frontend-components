import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const CloseModal = ({ onExit, onStay, isOpen, title, exitTitle, stayTitle, description }) => (
    <Modal
        variant="small"
        title={title}
        aria-label="Close add source wizard"
        header={
            <TextContent>
                <ExclamationTriangleIcon size="lg" className="ins-c-source__warning-icon" />
                <Text component={TextVariants.h1}>
                    {title}
                </Text>
            </TextContent>
        }
        isOpen={isOpen}
        onClose={onStay}
        actions={[
            <Button key="confirm" variant="primary" id="on-exit-button" onClick={onExit}>
                {exitTitle}
            </Button>,
            <Button key="cancel" variant="link" id="on-stay-button" onClick={onStay}>
                {stayTitle}
            </Button>
        ]}
    >
        {description}
    </Modal>
);

CloseModal.propTypes = {
    onExit: PropTypes.func.isRequired,
    onStay: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.node,
    exitTitle: PropTypes.node,
    stayTitle: PropTypes.node,
    description: PropTypes.node
};

CloseModal.defaultProps = {
    title: 'Exit source creation?',
    exitTitle: 'Exit',
    stayTitle: 'Stay',
    description: 'All inputs will be discarded.'
};

export default CloseModal;
