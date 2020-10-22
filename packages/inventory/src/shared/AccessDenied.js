import React from 'react';
import PropTypes from 'prop-types';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/components/cjs/NotAuthorized';

const AccessDenied = ({ title, description, ...props }) => (
    <NotAuthorized
        {...props}
        className="ins-c-inventory__no--access"
        title={title}
        description={description}
    />
);

AccessDenied.propTypes = {
    title: PropTypes.string,
    description: PropTypes.node
};

AccessDenied.defaultProps = {
    title: 'This application requires Inventory permissions',
    description: <div>
        To view the content of this page, you must be granted a minimum of inventory permissions from your Organization Administrator.
    </div>
};

export default AccessDenied;
