import React from 'react';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/components/esm/EmptyTable';
import { Title } from '@patternfly/react-core/dist/esm/components/Title';
import { EmptyStateBody, EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/esm/components/EmptyState';
import { Bullseye } from '@patternfly/react-core/dist/esm/layouts/Bullseye';

/**
 * Empty state stable when no systems are found.
 */
const NoSystemsTable = () => (
    <EmptyTable>
        <Bullseye>
            <EmptyState variant={ EmptyStateVariant.full }>
                <Title headingLevel="h5" size="lg">
                    No matching systems found
                </Title>
                <EmptyStateBody>
                    This filter criteria matches no systems. <br /> Try changing your filter settings.
                </EmptyStateBody>
            </EmptyState>
        </Bullseye>
    </EmptyTable>
);

export default NoSystemsTable;
