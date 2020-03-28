import React from 'react';
import propTypes from 'prop-types';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

const RuleLoadingTable = ({ columns }) => (
    <Table
        cells={ columns }
        aria-label='Loading table'
        rows={ [ ...Array(10) ].map(() => ({
            cells: [{
                title: <RowLoader />,
                colSpan: 5
            }]
        })) }>
        <TableHeader />
        <TableBody />
    </Table>
);

RuleLoadingTable.propTypes = {
    columns: propTypes.arrayOf(
        propTypes.shape(
            {
                title: propTypes.oneOfType([ propTypes.string, propTypes.object ]).isRequired,
                transforms: propTypes.array.isRequired,
                original: propTypes.string
            }
        )
    )
};

export default RuleLoadingTable;
