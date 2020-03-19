import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@patternfly/react-core';

const ValuePopover = ({ label, value }) => (
    <Popover
        headerContent={label}
        bodyContent={value}
        position="top"
        maxWidth="80%"
    >
        <Button variant="link" isInline className="ins-c-sources__wizard--summary-buttonss">Show more</Button>
    </Popover>
);

ValuePopover.propTypes = {
    label: PropTypes.node,
    value: PropTypes.node
};

export default ValuePopover;
