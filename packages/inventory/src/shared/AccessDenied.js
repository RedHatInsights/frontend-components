import React from 'react';
import PropTypes from 'prop-types';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Tooltip } from '@patternfly/react-core';

const AccessDenied = ({ title, description, ...props }) => (
    <NotAuthorized
        {...props}
        className="ins-c-inventory__no--access"
        title={title}
        description={<Tooltip content="inventory:*:read">
            {description}
        </Tooltip>}
    />
);

AccessDenied.propTypes = {
    title: PropTypes.string,
    description: PropTypes.node
};

AccessDenied.defaultProps = {
    title: 'You do not have access to Inventory',
    description: <div>
        To view your systems, you must be granted inventory access from your Organization Administrator.
    </div>
};

export default AccessDenied;
