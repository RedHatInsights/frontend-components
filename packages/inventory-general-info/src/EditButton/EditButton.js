import React from 'react';
import PropTypes from 'prop-types';

import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

import { PencilAltIcon } from '@patternfly/react-icons';

const InnerButton = ({ link, onClick }) => (
    <a
        className="ins-c-inventory__detail--action"
        href={ `${window.location.href}/${link}` }
        onClick={ onClick }
    >
        <PencilAltIcon />
    </a>
);

InnerButton.propTypes = {
    link: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

let permissionsCache = undefined;

const EditButtonUnknownPermissions = (props) => {
    const { hasAccess } = usePermissions('inventory', [
        'inventory:*:*',
        'inventory:hosts:write',
        'inventory:*:write'
    ]);

    if (hasAccess) {
        permissionsCache = hasAccess;
    }

    if (!hasAccess) {
        return null;
    }

    return <InnerButton {...props}/>;
};

EditButtonUnknownPermissions.propTypes = {
    link: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

const EditButtonWrapper = ({ writePermissions, ...props }) => {
    if (insights.chrome.isProd || writePermissions || permissionsCache) {
        return <InnerButton {...props} />;
    }

    if (typeof writePermissions !== 'boolean') {
        return <EditButtonUnknownPermissions {...props} />;
    }

    return null;
};

EditButtonWrapper.propTypes = {
    writePermissions: PropTypes.bool
};

export default EditButtonWrapper;
