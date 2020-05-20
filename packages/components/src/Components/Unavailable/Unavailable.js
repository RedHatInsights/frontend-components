import React from 'react';

import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';
import { StackItem } from '@patternfly/react-core/dist/js/layouts/Stack/StackItem';

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
                Unable to connect
            </Title>
            <EmptyStateBody>
                <Stack>
                    <StackItem>
                        This page is temporarily unavailable. Try refreshing the page.
                    </StackItem>
                    <StackItem>
                        If the problem persists, conact your administrator.
                    </StackItem>
                    <StackItem>
                        See <a href='./status' target='_blank' rel='noopener noreferrer'>cloud.redhat.com/status</a> for more information.
                    </StackItem>
                </Stack>
            </EmptyStateBody>
        </EmptyState>
    );
};

export default Unavailable;
