import React from 'react';
import PropTypes from 'prop-types';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { Spinner } from '@patternfly/react-core';

const RenderWrapper = ({ cmp: Component, hideLoader, isRbacEnabled, inventoryRef, store, ...props }) => {
    const { hasAccess } = usePermissions('inventory', [
        'inventory:*:*',
        'inventory:*:read',
        'inventory:hosts:read'
    ]);
    return (
        (hasAccess === undefined && !hideLoader) ?
            <Spinner /> :
            <Component
                {...props}
                { ...inventoryRef && {
                    ref: inventoryRef
                }}
                hasAccess={isRbacEnabled ? hasAccess : true}
                store={ store }
            />
    );
};

RenderWrapper.propTypes = {
    cmp: PropTypes.any,
    inventoryRef: PropTypes.any,
    store: PropTypes.object,
    customRender: PropTypes.bool,
    isRbacEnabled: PropTypes.bool,
    hideLoader: PropTypes.bool
};

export default RenderWrapper;
