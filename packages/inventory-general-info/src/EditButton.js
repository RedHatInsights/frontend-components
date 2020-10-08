import React from 'react';
import PropTypes from 'prop-types';

import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/files/RBACHook';

import { PencilAltIcon } from '@patternfly/react-icons';

const EditButton = ({ link, onClick }) => {
    const { hasAccess } = usePermissions('inventory', [
        'inventory:*:*',
        'inventory:hosts:write',
        'inventory:*:write'
    ]);

    const canPerformActions = insights.chrome.isProd || hasAccess;

    if (!canPerformActions) {
        return null;
    }

    return (
        <a
            className="ins-c-inventory__detail--action"
            href={ `${window.location.href}/${link}` }
            onClick={ onClick }
        >
            <PencilAltIcon />
        </a>
    );
};

EditButton.propTypes = {
    link: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default EditButton;
