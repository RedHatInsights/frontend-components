import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const CloseModal = ({ onExit, onStay, isOpen, title }) => (<Modal
    isSmall
    title={title}
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
    Exit
        </Button>,
        <Button key="cancel" variant="link" id="on-stay-button" onClick={onStay}>
    Stay
        </Button>
    ]}
    isFooterLeftAligned
>
All inputs will be discarded.
</Modal>);

CloseModal.propTypes = {
    onExit: PropTypes.func.isRequired,
    onStay: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    title: PropTypes.node
};

CloseModal.defaultProps = {
    title: 'Exit source creation?'
};

export default CloseModal;
