import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';

import generateFilters from './filters';

const TableToolbar = ({
    state,
    paginationConfig,
    actionsConfig,
    dispatch,
    enabledFilters,
    bulkSelect,
    rows,
    selectAll,
    children,
    noAccess
}) => {
    const [ textFilters, setTextFilter ] = useState({});

    const updateTextFilter = (key, value) => setTextFilter({ ...textFilters, [key]: value });

    const bulkSelectConfig = useMemo(() => (
        {
            count: state.selected.length,
            isDisabled: (state.total === 0 && state.selected.length === 0) || !state.isLoaded || noAccess,
            checked: rows.every(({ selected }) => selected) || (rows.some(({ selected }) => selected) && null),
            onSelect: () => rows.some(({ selected }) => selected) ? dispatch({ type: 'unselectPage' }) : dispatch({ type: 'selectPage' }),
            items: [
                {
                    title: 'Select none (0)',
                    onClick: () => dispatch({ type: 'selectNone' })
                },
                ...state.isLoaded && rows?.length > 0 ? [{
                    title: `Select page (${ rows.length })`,
                    onClick: () => dispatch({ type: 'selectPage' })
                }] : [{}],
                ...selectAll && state.isLoaded && rows?.length > 0 ? [{
                    title: `Select all (${ state.total })`,
                    onClick: () => selectAll((selected) => dispatch({ type: 'selectAll', payload: { selected } }))
                }] : [{}]
            ]
        }
    ), [ state.selected, state.total, state.isLoaded, noAccess, rows.length, Boolean(selectAll) ]);

    return (
        <PrimaryToolbar
            pagination={state.isLoaded ? paginationConfig : <Skeleton size={SkeletonSize.lg} /> }
            filterConfig={
                generateFilters(
                    enabledFilters,
                    {},
                    state.filters,
                    (key, value) => dispatch({ type: 'setFilter', payload: { key, value } }),
                    textFilters,
                    updateTextFilter
                )
            }
            {...actionsConfig && { actionsConfig }}
            {...bulkSelect && {
                bulkSelect: bulkSelectConfig
            }}
        >{children}</PrimaryToolbar>
    );
};

TableToolbar.propTypes = {
    state: PropTypes.object,
    paginationConfig: PropTypes.object,
    actionsConfig: PropTypes.object,
    dispatch: PropTypes.func,
    enabledFilters: PropTypes.object,
    bulkSelect: PropTypes.bool,
    rows: PropTypes.array,
    selectAll: PropTypes.func,
    children: PropTypes.node,
    noAccess: PropTypes.bool
};

export default TableToolbar;
