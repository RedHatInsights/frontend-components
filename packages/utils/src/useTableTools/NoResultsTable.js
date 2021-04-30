import React from 'react';
import {
    Bullseye, EmptyState, EmptyStateBody, EmptyStateVariant, Title
} from '@patternfly/react-core';
import EmptyTable from '@redhat-cloud-services/frontend-components/EmptyTable';

const NoResultsTable = () => (
    <EmptyTable>
        <Bullseye>
            <EmptyState variant={ EmptyStateVariant.full }>
                <Title headingLevel="h5" size="lg">
                    No matching results found
                </Title>
                <EmptyStateBody>
                    This filter criteria matches no results. <br /> Try changing your filter settings.
                </EmptyStateBody>
            </EmptyState>
        </Bullseye>
    </EmptyTable>
);

export const emptyRows = [{
    cells: [
        {
            title: () => (<NoResultsTable />),  // eslint-disable-line
            props: {
                colSpan: 3
            }
        }
    ]
}];

export default NoResultsTable;
