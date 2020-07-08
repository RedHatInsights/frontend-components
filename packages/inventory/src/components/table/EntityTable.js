import React from 'react';
import PropTypes from 'prop-types';
import { selectEntity, setSort } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint,
    TableVariant
} from '@patternfly/react-table';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/components/esm/SkeletonTable';
import { createRows, createColumns } from './helpers';

const EntityTable = ({
    hasItems,
    isLoaded,
    expandable,
    onExpandClick,
    hasCheckbox,
    actions,
    variant,
    sortBy,
    tableProps,
    onSort,
    expandable: isExpandable,
    onRowClick,
    noDetail
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const loaded = useSelector(({ entities: { loaded } }) => (
        hasItems && isLoaded !== undefined ? (isLoaded && loaded) : loaded
    ));
    const rows = useSelector(({ entities: { rows } }) => rows);
    const columns = useSelector(({ entities: { columns } }) => columns);

    const onItemSelect = (_event, checked, rowId) => {
        const row = isExpandable ? rows[rowId / 2] : rows[rowId];
        dispatch(selectEntity(rowId === -1 ? 0 : row.id, checked));
    };

    const onSortChange = (_event, key, direction, index) => {
        if (key !== 'action' && key !== 'health') {
            dispatch(setSort({ index, key, direction }));
        }

        onSort?.({ index, key, direction });
    };

    const cells = loaded && createColumns(columns, hasItems, rows, isExpandable);

    const defaultRowClick = (_event, key) => {
        history.push(`/${key}`);
    };

    return (
        <React.Fragment>
            { loaded && cells ?
                PfTable && <PfTable
                    variant={ variant }
                    aria-label="Host inventory"
                    cells={ cells }
                    rows={ createRows(
                        rows,
                        columns,
                        {
                            actions,
                            expandable,
                            loaded,
                            onRowClick: onRowClick || defaultRowClick,
                            noDetail,
                            sortBy
                        })
                    }
                    gridBreakPoint={
                        columns?.length > 5 ?
                            TableGridBreakpoint.gridLg :
                            TableGridBreakpoint.gridMd
                    }
                    className="ins-c-entity-table"
                    onSort={ (event, index, direction) => {
                        onSortChange(
                            event,
                            cells?.[index - Boolean(hasCheckbox) - Boolean(expandable)]?.key,
                            direction,
                            index
                        );
                    } }
                    sortBy={ {
                        index: cells?.findIndex(item => sortBy?.key === item.key) + Boolean(hasCheckbox) + Boolean(expandable),
                        direction: sortBy?.direction
                    } }
                    { ...{
                        ...hasCheckbox && rows?.length !== 0 ? { onSelect: onItemSelect } : {},
                        ...expandable ? { onCollapse: onExpandClick } : {},
                        ...actions && rows?.length > 0 && { actions }
                    } }
                    { ...tableProps }
                >
                    <TableHeader />
                    <TableBody />
                </PfTable> :
                <SkeletonTable colSize={ columns?.length || 3 } rowSize={ 15 } />
            }
        </React.Fragment>
    );
};

EntityTable.propTypes = {
    variant: PropTypes.oneOf(Object.values(TableVariant || {})),
    expandable: PropTypes.bool,
    onExpandClick: PropTypes.func,
    onSort: PropTypes.func,
    hasCheckbox: PropTypes.bool,
    showActions: PropTypes.bool,
    hasItems: PropTypes.bool,
    showHealth: PropTypes.bool,
    sortBy: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.oneOf([ 'asc', 'desc' ])
    }),
    tableProps: PropTypes.shape({
        [PropTypes.string]: PropTypes.any
    }),
    onRowClick: PropTypes.func,
    showTags: PropTypes.bool
};

EntityTable.defaultProps = {
    loaded: false,
    showHealth: false,
    expandable: false,
    hasCheckbox: true,
    showActions: false,
    columns: [],
    rows: [],
    onExpandClick: () => undefined,
    tableProps: {}
};

export default EntityTable;
