import React from 'react';

import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';

import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';

const Unavailable = () => {
    return (
        <EmptyState variant={EmptyStateVariant.large} className='ins-c-empty-state__unavailable pf-m-redhat-font'>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel="h5" size="lg">
                This page is temporarily unavailable
            </Title>
            <EmptyStateBody>
                Try refreshing the page. If the problem persists, contact your organization administrator or visit our
                <a href='https://status.redhat.com/' target='_blank' rel='noopener noreferrer'> status page</a> for known outages.
            </EmptyStateBody>
        </EmptyState>
    );
};

export default Unavailable;
