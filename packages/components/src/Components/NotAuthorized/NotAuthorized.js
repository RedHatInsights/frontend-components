import React from 'react';
import PropTypes from 'prop-types';

import {
    Title,
    Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';

import { LockIcon } from '@patternfly/react-icons';

import './NotAuthorized.scss';

const NotAuthorized = ({ serviceName }) => {
    return (
        <React.Fragment>
            <EmptyState variant={ EmptyStateVariant.full } className='ins-c-not-authorized'>
                <EmptyStateIcon icon={ LockIcon } />
                <Title headingLevel="h5" size="lg"> You do not have access to { serviceName }</Title>
                <EmptyStateBody>
                    Contact your organization administrator(s) or visit <a href={`./${window.insights.chrome.isBeta() ? 'beta/' : ''}settings/my-user-access`}> My User Access </a> for more information.
                </EmptyStateBody>
                {
                    document.referrer ?
                        <Button variant="primary" onClick={ () => history.back() }>Return to previous page</Button> :
                        <Button variant="primary" component="a" href=".">Go to landing page</Button>
                }
            </EmptyState>
        </React.Fragment>
    );
};

NotAuthorized.propTypes = {
    serviceName: PropTypes.node
};

export default NotAuthorized;
