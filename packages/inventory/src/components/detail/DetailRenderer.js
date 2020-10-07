import React from 'react';
import PropTypes from 'prop-types';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/files/RBACHook';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import DetailWrapper from './DetailWrapper';
import AccessDenied from '../../shared/AccessDenied';

const DetailRenderer = ({ showInventoryDrawer, isRbacEnabled, ...props }) => {
    const { hasAccess } = usePermissions('inventory', [ 'inventory:*:*', 'inventory:hosts:read' ]);
    if (hasAccess === undefined) {
        return <Spinner />;
    } else if (isRbacEnabled && hasAccess === false) {
        return <AccessDenied />;
    } else {
        return showInventoryDrawer ? <DetailWrapper {...props} /> : <React.Fragment {...props} />;
    }
};

DetailWrapper.propTypes = {
    showInventoryDrawer: PropTypes.bool,
    isRbacEnabled: PropTypes.bool
};

DetailWrapper.defaultProps = {
    showInventoryDrawer: false
};

export default DetailRenderer;
