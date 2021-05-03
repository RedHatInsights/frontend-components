import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { selectEntity, setSort } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint
} from '@patternfly/react-table';
import { mergeArraysByKey } from '@redhat-cloud-services/frontend-components-utilities/helpers/helpers';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import NoSystemsTable from './NoSystemsTable';
import { createRows, createColumns } from './helpers';
import { defaultColumns } from '../../redux/entities';

/**
 * The actual (PF)table component. It calculates each cell and every table property.
 * It uses rows, columns and loaded from redux to show correct data.
 * When row is selected `selectEntity` is dispatched.
 * @param {*} props all props used in this component.
 */
const EntityTable = ({
    hasItems,
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
    noDetail,
    noSystemsTable = <NoSystemsTable />,
    showTags,
    columns: columnsProp,
    disableDefaultColumns,
    loaded,
    columnsCounter
}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const rows = useSelector(({ entities: { rows } }) => rows);
    const columnsRedux = useSelector(
        ({ entities: { columns } }) => columns,
        (next, prev) => next.every(
            ({ key }, index) => prev.findIndex(({ key: prevKey }) => prevKey === key) === index
        )
    );

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

    const columns = useRef([]);
    useMemo(() => {
        if (typeof columnsProp === 'function') {
            columns.current = columnsProp(defaultColumns);
        } else if (columnsProp) {
            const disabledColumns = Array.isArray(disableDefaultColumns) ? disableDefaultColumns : [];
            const defaultColumnsFiltered = defaultColumns.filter(({ key }) =>
                (key === 'tags' && showTags) || (key !== 'tags' && !disabledColumns.includes(key))
            );
            columns.current = mergeArraysByKey([
                typeof disableDefaultColumns === 'boolean' && disableDefaultColumns ? [] : defaultColumnsFiltered,
                columnsProp
            ], 'key');
        } else {
            columns.current = columnsRedux;
        }
    }, [
        showTags,
        Array.isArray(disableDefaultColumns) ? disableDefaultColumns.join() : disableDefaultColumns,
        Array.isArray(columnsProp) ? columnsProp.map(({ key }) => key).join() : typeof columnsProp === 'function' ? 'function' : columnsProp,
        Array.isArray(columnsRedux) ? columnsRedux.map(({ key }) => key).join() : columnsRedux,
        columnsCounter
    ]);

    const cells = loaded && createColumns(columns.current, hasItems, rows, isExpandable);

    const defaultRowClick = (_event, key) => {
        history.push(`${location.pathname}${location.pathname.slice(-1) === '/' ? '' : '/'}${key}`);
    };

    const { RowWrapper: tableRowWrapper, ...additionalTableProps } = tableProps;

    return (
        <React.Fragment>
            { loaded && cells ?
                PfTable && <PfTable
                    variant={ variant }
                    aria-label="Host inventory"
                    cells={ cells }
                    rows={ createRows(
                        rows,
                        columns.current,
                        {
                            actions,
                            expandable,
                            loaded,
                            onRowClick: onRowClick || defaultRowClick,
                            noDetail,
                            sortBy,
                            noSystemsTable
                        })
                    }
                    gridBreakPoint={
                        columns.current?.length > 5 ?
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
                    { ...additionalTableProps }
                >
                    <TableHeader />
                    <TableBody />
                </PfTable> :
                <SkeletonTable colSize={ columns.current?.length || 3 } rowSize={ 15 } />
            }
        </React.Fragment>
    );
};

EntityTable.propTypes = {
    variant: PropTypes.oneOf([ 'compact' ]),
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
        [PropTypes.string]: PropTypes.any,
        RowWrapper: PropTypes.elementType
    }),
    onRowClick: PropTypes.func,
    showTags: PropTypes.bool,
    noSystemsTable: PropTypes.node,
    disableDefaultColumns: PropTypes.oneOfType([ PropTypes.bool, PropTypes.arrayOf(PropTypes.string) ]),
    loaded: PropTypes.bool,
    columnsCounter: PropTypes.number,
    columns: PropTypes.oneOfType([ PropTypes.array, PropTypes.func ]),
    isLoaded: PropTypes.bool,
    actions: PropTypes.object,
    noDetail: PropTypes.any
};

EntityTable.defaultProps = {
    loaded: false,
    showHealth: false,
    expandable: false,
    hasCheckbox: true,
    showActions: false,
    rows: [],
    onExpandClick: () => undefined,
    tableProps: {}
};

export default EntityTable;
