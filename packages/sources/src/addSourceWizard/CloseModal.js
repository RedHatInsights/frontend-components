import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, TextContent, Text, TextVariants } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { useIntl, FormattedMessage } from 'react-intl';

const CloseModal = ({ onExit, onStay, isOpen, title, exitTitle, stayTitle, description }) => {
    const intl = useIntl();

    return (
        <Modal
            variant="small"
            title={title}
            aria-label={intl.formatMessage({ id: 'wizard.closeAriaLabel', defaultMessage: 'Close add source wizard' })}
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
    );};

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
    title: <FormattedMessage id="wizard.closeTitle" defaultMessage="Exit source creation?"/>,
    exitTitle: <FormattedMessage id="wizard.exitText" defaultMessage="Exit"/>,
    stayTitle: <FormattedMessage id="wizard.stayText" defaultMessage="Stay"/>,
    description: <FormattedMessage id="wizard.closeWarning" defaultMessage="All inputs will be discarded."/>
};

export default CloseModal;
