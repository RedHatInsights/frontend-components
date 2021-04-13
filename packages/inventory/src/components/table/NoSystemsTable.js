import React from 'react';
import { EmptyTable } from '@redhat-cloud-services/frontend-components/EmptyTable';
import { EmptyStateBody, EmptyState, EmptyStateVariant, Title, Bullseye } from '@patternfly/react-core';

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
