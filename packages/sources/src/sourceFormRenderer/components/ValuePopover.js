import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popover } from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';

const ValuePopover = ({ label, value }) => (
    <Popover
        headerContent={label}
        bodyContent={value}
        position="top"
        maxWidth="80%"
    >
        <Button variant="link" isInline className="ins-c-sources__wizard--summary-buttonss">
            <FormattedMessage id="wizard.ShowMore" defaultMessage="Show more" />
        </Button>
    </Popover>
);

ValuePopover.propTypes = {
    label: PropTypes.node,
    value: PropTypes.node
};

export default ValuePopover;
