import React, { Fragment } from 'react';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/components/cjs/NotAuthorized';

const AccessDenied = (props) => (
    <NotAuthorized
        {...props}
        serviceName="Inventory"
        description={
            <Fragment>
                <div>Your organization administrator must grant</div>
                <div>you inventory access to view your systems.</div>
            </Fragment>
        }
    />
);

export default AccessDenied;
