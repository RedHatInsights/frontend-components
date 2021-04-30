import React from 'react';
import propTypes from 'prop-types';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { Table, TableBody, TableHeader } from '@patternfly/react-table';
import PrimaryToolbar from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';

import useTableTools from './useTableTools';

const TableToolsTable = ({
    items = [], columns = [], filters = [], onSelect, ...tablePropsRest
}) => {
    const { toolbarProps, tableProps } = useTableTools(items, columns, {
        filterConfig: filters,
        onSelect
    });

    return <React.Fragment>

        <PrimaryToolbar
            { ...toolbarProps } />

        <Table
            { ...tableProps }
            { ...tablePropsRest }>
            <TableHeader />
            <TableBody />
        </Table>

        <TableToolbar isFooter>
            <Pagination
                variant={ PaginationVariant.bottom }
                { ...toolbarProps.pagination } />
        </TableToolbar>

    </React.Fragment>;
};

TableToolsTable.propTypes = {
    items: propTypes.array.isRequired,
    columns: propTypes.arrayOf(propTypes.shape({
        title: propTypes.string,
        transforms: propTypes.array,
        sortByProperty: propTypes.string,
        sortByArray: propTypes.array,
        sortByFunction: propTypes.func,
        renderFunc: propTypes.func
    })).isRequired
};

export default TableToolsTable;
