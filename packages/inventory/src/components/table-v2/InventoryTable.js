import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';

import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import { ErrorState } from '@redhat-cloud-services/frontend-components/ErrorState';

import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint
} from '@patternfly/react-table';

import AccessDenied from '../../shared/AccessDenied';
import { createColumns, createRows } from '../table/helpers';
import NoSystemsTable from '../table/NoSystemsTable';
import useColumns from './useColumns';
import useCallbackReducer from './useCallbackReducer';
import { getEntities as apiGetEntities } from './api';

const initialStateReducer = {
    orderBy: 'updated',
    orderDirection: 'DESC',
    page: 1,
    perPage: 50,
    filters: {},
    entities: [],
    total: 0,
    loadingCounter: 0,
    isLoaded: false,
    error: false,
    selected: []
};

const reducer = (state, action) => {
    console.log(action.type, action);
    switch (action.type) {
        case 'selectNone':
            return { ...state, selected: [] };
        case 'selectPage':
            return { ...state, selected: [ ...state.selected, ...state.entities.map(entity => !state.selected.includes(entity.id) && entity.id).filter(Boolean) ] };
        case 'unselectPage':
            return { ...state, selected: state.selected.filter(id => !state.entities.find((entity) => entity.id === id)) };
        case 'selectEntity':
            return { ...state, selected: action.payload.checked ? [ ...state.selected, action.payload.id ] : state.selected.filter((item) => item !== action.payload.id) };
        case 'setLoaded':
            return { ...state, isLoaded: false, ...action.payload.options };
        case 'setResults':
            return { ...state, total: action.payload.results.total, entities: action.payload.results.results, isLoaded: true };
        case 'setError':
            return { ...state, error: true };
        default:
            return state;
    }
};

const InventoryTable = ({
    hasAccess,
    isFullView,
    errorState = <ErrorState />,
    paginationProps = {},
    tableProps = {},
    columns,
    noSystemsTable = <NoSystemsTable />,
    onRowClick,
    showTags,
    disableDefaultColumns,
    columnsCounter,
    bulkSelect,
    hasCheckbox,
    expandable,
    actions,
    noDetail,
    getEntities,
    selectAll
}) => {
    const [ state, dispatch ] = useCallbackReducer(reducer, initialStateReducer);
    const columnsRef = useColumns({ columns, showTags, disableDefaultColumns, columnsCounter });

    const history = useHistory();
    const location = useLocation();

    const refreshData = async (options) => {
        dispatch({ type: 'setLoaded', payload: { options } }, async (state) => {
            try {
                const params = {
                    filters: state.filters,
                    perPage: state.perPage,
                    page: state.page,
                    orderBy: state.orderBy,
                    orderDirection: state.orderDirection,
                    tags: [], // ?
                    filter: {}, // ?
                    showTags
                };

                const results = !getEntities ? await apiGetEntities(params) : await getEntities(params, apiGetEntities);

                dispatch({ type: 'setResults', payload: { results } });
            } catch (e) {
                console.error(e);
                dispatch({ type: 'setError' });
            }
        });
    };

    useState(() => {
        !state.isLoaded && refreshData();
    }, []);

    const noAccess = hasAccess === false;

    if (noAccess && isFullView) {
        return <AccessDenied
            title="This application requires Inventory permissions"
            description={<div>
            To view the content of this page, you must be granted a minimum of inventory permissions from your Organization Administrator.
            </div>}
        />;
    }

    if (state.error) {
        return errorState;
    }

    const paginationConfig = {
        itemCount: state.total,
        page: state.page,
        perPage: state.perPage,
        onSetPage: (_e, newPage) => refreshData({ page: newPage }),
        onPerPageSelect: (_e, newPerPage) => refreshData({ page: 1, perPage: newPerPage }),
        ...paginationProps
    };

    const paginationConfigBottom = {
        ...paginationConfig,
        dropDirection: 'up',
        variant: 'bottom',
        isCompact: false
    };

    const cells = state.isLoaded && createColumns(columnsRef.current, false, state.entities, expandable);

    const defaultRowClick = (_event, key) => {
        history.push(`${location.pathname}${location.pathname.slice(-1) === '/' ? '' : '/'}${key}`);
    };

    const rows = createRows(
        state.entities,
        columnsRef.current,
        {
            actions,
            expandable,
            loaded: state.isLoaded,
            onRowClick: onRowClick || defaultRowClick,
            noDetail,
            sortBy: state.orderBy,
            noSystemsTable
        });

    state.selected.forEach(id => {
        const index = rows.findIndex(row => row.id === id);
        if (index >= 0) {
            rows[index].selected = true;
        }
    });

    const onItemSelect = (_event, checked, rowId) => {
        const row = expandable ? state.entities[rowId / 2] : state.entities[rowId];
        dispatch({ type: 'selectEntity', payload: { id: rowId === -1 ? 0 : row.id, checked } });
    };

    const onExpandClick = () => null;

    const onSortChange = (orderBy, orderDirection) => refreshData({ orderBy, orderDirection: orderDirection.toUpperCase() });

    return (<React.Fragment>
        <PrimaryToolbar
            pagination={state.isLoaded ? paginationConfig : <Skeleton size={SkeletonSize.lg} /> }
            {...bulkSelect && {
                bulkSelect: {
                    ...bulkSelect,
                    count: state.selected.length,
                    isDisabled: bulkSelect?.isDisabled || noAccess,
                    checked: rows.every(({ selected }) => selected) || (rows.some(({ selected }) => selected) && null),
                    onSelect: () => rows.some(({ selected }) => selected) ? dispatch({ type: 'unselectPage' }) : dispatch({ type: 'selectPage' }),
                    items: [{
                        title: 'Select none (0)',
                        onClick: () => dispatch({ type: 'selectNone' })
                    },
                    ...state.isLoaded && rows?.length > 0 ? [{
                        title: `Select page (${ rows.length })`,
                        onClick: () => dispatch({ type: 'selectPage' })
                    }] : [{}],
                    ...selectAll && state.isLoaded && rows?.length > 0 ? [{
                        title: `Select all (${ state.total })`,
                        onClick: () => selectAll({ state, dispatch })
                    }] : [{}]
                    ]
                }
            }}
        />
        {!state.isLoaded && <SkeletonTable colSize={ columnsRef.current?.length || 3 } rowSize={ 15 } />}
        {state.isLoaded && noAccess && <div className="ins-c-inventory__no-access">
            <AccessDenied showReturnButton={false} />
        </div>}
        { state.isLoaded && !noAccess &&
            <PfTable
                aria-label="Host inventory"
                className="ins-c-entity-table"
                cells={ cells }
                rows={ rows }
                gridBreakPoint={
                    columnsRef.current?.length > 5 ? TableGridBreakpoint.gridLg : TableGridBreakpoint.gridMd
                }
                onSort={ (_event, index, direction) => {
                    onSortChange(
                        cells[index - Boolean(hasCheckbox) - Boolean(expandable)]?.key,
                        direction
                    );
                } }
                sortBy={ {
                    index: cells.findIndex(item => state.orderBy === item.key) + Boolean(hasCheckbox) + Boolean(expandable),
                    direction: state.orderDirection.toLowerCase()
                } }
                { ...tableProps }
                { ...{
                    ...hasCheckbox && state.entities.length !== 0 ? { onSelect: onItemSelect } : {},
                    ...expandable ? { onCollapse: onExpandClick } : {},
                    ...actions && state.entities.length > 0 && { actions }
                } }
            >
                <TableHeader />
                <TableBody />
            </PfTable>
        }
        {state.isLoaded && <PrimaryToolbar pagination={paginationConfigBottom} />}
    </React.Fragment>);
};

InventoryTable.propTypes = {
    // autoRefresh: PropTypes.bool,
    // onRefresh: PropTypes.func,
    // children: PropTypes.node,
    // inventoryRef: PropTypes.object,
    // items: PropTypes.array,
    // total: PropTypes.number,
    // page: PropTypes.number,
    // perPage: PropTypes.number,
    // filters: PropTypes.any,
    showTags: PropTypes.bool,
    // sortBy: PropTypes.object,
    customFilters: PropTypes.any,
    hasAccess: PropTypes.bool,
    isFullView: PropTypes.bool,
    getEntities: PropTypes.func,
    hideFilters: PropTypes.object,
    paginationProps: PropTypes.object,
    errorState: PropTypes.node,
    tableProps: PropTypes.object,
    columns: PropTypes.any,
    noSystemsTable: PropTypes.node,
    onRowClick: PropTypes.func,
    disableDefaultColumns: PropTypes.oneOfType([ PropTypes.bool, PropTypes.arrayOf(PropTypes.string) ]),
    columnsCounter: PropTypes.number,
    bulkSelect: PropTypes.object,
    hasCheckbox: PropTypes.bool,
    expandable: PropTypes.bool,
    actions: PropTypes.node,
    noDetail: PropTypes.bool,
    selectAll: PropTypes.func
    // isLoaded: PropTypes.bool,
    // initialLoading: PropTypes.bool,
    // ignoreRefresh: PropTypes.bool,
    // showTagModal: PropTypes.bool
};

export default InventoryTable;
