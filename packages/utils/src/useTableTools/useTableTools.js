import { useEffect } from 'react';
import useFilterConfig from './useFilterConfig';
import useTableSort from './useTableSort';
import { default as usePaginate } from './usePaginate';
import useRowsBuilder from './useRowsBuilder';
import useBulkSelect from './useBulkSelect';
import useRowIdentify from './useRowIdentify';
import useConditionalTableHook from './useConditionalTableHook';

const useTableTools = (items = [], columns = [], options = {}) => {
    const enableFilters = !!options.filterConfig;
    const enableBulkSelect = !!options.onSelect;
    const enablePagination = options?.pagination !== false;
    const perPage = options?.perPage || 10;

    const identify = useRowIdentify(options);
    const identifiedItems = identify(items);

    const {
        tableProps: sortableTableProps, columns: sortableColumns, sorter
    } = useTableSort(columns, options);

    const {
        filter, toolbarProps: conditionalFilter, activeFilters, addConfigItem: addFilterConfigItem
    } = useConditionalTableHook(enableFilters, useFilterConfig, options.filterConfig);

    const paginate = useConditionalTableHook(enablePagination, usePaginate, {
        ...options,
        perPage,
        itemCount: items.length
    });

    const {
        transformer: selectItem, toolbarProps: bulkSelectToolbarProps,
        tableProps: bulkSelectTableProps, clearSelection
    } = useConditionalTableHook(enableBulkSelect, useBulkSelect, {
        ...options,
        items: identifiedItems,
        filter,
        addFilterConfigItem,
        paginate,
        sorter
    });

    const transformers = [
        selectItem
    ];

    const rowBuilder = useRowsBuilder(columns, {
        detailsComponent: options.detailsComponent,
        emptyRows: options.emptyRows,
        transformers,
        filter,
        paginate,
        sorter
    });
    const { rows, pagination } = rowBuilder(identifiedItems);

    useEffect(() => {
        if (paginate.setPage) {
            paginate.setPage(1);
        }
    }, [ activeFilters ]);

    useEffect(() => {
        if (clearSelection) {
            clearSelection();
        }
    }, [ items ]);

    return {
        toolbarProps: {
            pagination,
            ...bulkSelectToolbarProps,
            ...conditionalFilter
        },
        tableProps: {
            rows,
            cells: sortableColumns,
            ...sortableTableProps,
            ...bulkSelectTableProps
        }
    };
};

export default useTableTools;
