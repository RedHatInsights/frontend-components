import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { CubesIcon } from '@patternfly/react-icons';

const MessageState = ({ children, icon, iconClass, iconStyle, size, text, title, variant }) => (
    <EmptyState variant={variant}>
        {icon !== 'none' && <EmptyStateIcon className={iconClass} style={iconStyle} icon={icon} size={size} />}
        <Title headingLevel='h5' size='lg'>
            {title}
        </Title>
        <EmptyStateBody style={{ marginBottom: '16px' }}>
            {text}
        </EmptyStateBody>
        {children}
    </EmptyState>
);

MessageState.propTypes = {
    children: PropTypes.any,
    icon: PropTypes.any,
    iconClass: PropTypes.any,
    iconStyle: PropTypes.any,
    size: PropTypes.string,
    text: PropTypes.any,
    title: PropTypes.string,
    variant: PropTypes.any
};

MessageState.defaultProps = {
    icon: CubesIcon,
    title: '',
    variant: EmptyStateVariant.full,
    size: ''
};

export default MessageState;
