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
    orderBy: '',
    orderDirection: '',
    page: 0,
    perPage: 50,
    filters: {},
    entities: [],
    total: 0,
    loadingCounter: 0,
    isLoaded: true,
    error: false,
    selected: []
};

const reducer = (state, action) => {
    switch (action.type) {
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
    getEntities
}) => {
    const [ state, dispatch ] = useCallbackReducer(reducer, initialStateReducer);
    const columnsRef = useColumns({ columns, showTags, disableDefaultColumns, columnsCounter });

    const history = useHistory();
    const location = useLocation();

    const refreshData = async (options) => {
        dispatch({ type: 'entitiesPending', options }, async (state) => {
            try {
                const results = await apiGetEntities(
                    items,
                    filters,
                    perPage,
                    page,
                    orderBy,
                    orderDirection,
                    fields = { system_profile: [ 'operating_system' ] },
                    tags, // ?
                    filter, // ?
                    showTags
                );


            } catch {
                dispatch({ type: 'setError' });
            }
        });
    };

    useState(() => {

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
        onSetPage: () => null,
        onPerPageSelect: () => null,
        ...paginationProps
    };

    const paginationConfigBottom = {
        ...paginationConfig,
        dropDirection: 'up',
        variant: 'bottom',
        isCompact: false
    };

    const { hasCheckbox, expandable, actions, noDetail, ...tablePropsRest } = tableProps;

    const cells = state.isLoaded && createColumns(columnsRef.current, false, state.entities, expandable);

    const defaultRowClick = (_event, key) => {
        history.push(`${location.pathname}${location.pathname.slice(-1) === '/' ? '' : '/'}${key}`);
    };

    const onItemSelect = () => null;

    const onExpandClick = () => null;

    const onSortChange = () => null;

    return (<React.Fragment>
        <PrimaryToolbar
            pagination={state.isLoaded ? paginationConfig : <Skeleton size={SkeletonSize.lg} /> }
            {...bulkSelect && {
                bulkSelect: {
                    ...bulkSelect,
                    isDisabled: bulkSelect?.isDisabled || noAccess
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
                cells={ cells }
                rows={ createRows(
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
                    })
                }
                gridBreakPoint={
                    columnsRef.current?.length > 5 ? TableGridBreakpoint.gridLg : TableGridBreakpoint.gridMd
                }
                className="ins-c-entity-table"
                onSort={ (event, index, direction) => {
                    onSortChange(
                        event,
                        cells[index - Boolean(hasCheckbox) - Boolean(expandable)]?.key,
                        direction,
                        index
                    );
                } }
                sortBy={ {
                    index: cells.findIndex(item => state.orderBy === item.key) + Boolean(hasCheckbox) + Boolean(expandable),
                    direction: state.orderDirection
                } }
                { ...tablePropsRest }
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
    bulkSelect: PropTypes.object
    // isLoaded: PropTypes.bool,
    // initialLoading: PropTypes.bool,
    // ignoreRefresh: PropTypes.bool,
    // showTagModal: PropTypes.bool
};

export default InventoryTable;
