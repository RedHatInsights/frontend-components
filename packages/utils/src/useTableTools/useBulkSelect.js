import { useState, useEffect } from 'react';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const compileTitle = (itemsTotal, titleOption) => {
    if (typeof titleOption === 'string') {
        return titleOption;
    } else if (typeof titleOption === 'function') {
        return titleOption(itemsTotal);
    } else {
        return `${ itemsTotal } selected`;
    }
};

const checkboxState = (selectedItemsTotal, itemsTotal) => {
    if (selectedItemsTotal === 0) {
        return false;
    } else if (selectedItemsTotal === itemsTotal) {
        return true;
    } else {
        return null;
    }
};

const allItemsIncluded = (items, selection) => (
    items.filter((item) => (
        selection.includes(item)
    )).length === items.length
);

const selectOrUnselect = (selected) => (
    selected ? 'Unselect' : 'Select'
);

const checkCurrentPageSelected = (items, selectedItems) => {
    if (items.length === 0) {
        return false;
    } else {
        return allItemsIncluded(items, selectedItems);
    }
};

const itemIds = (items) => (items.map((item) => (item.itemId)));
const mergeArraysUniqly = (arrayA, arrayB) => (
    Array.from(new Set([ ...arrayA, ...arrayB ]))
);

const SELECTED_FILTER =  {
    type: conditionalFilterType.checkbox,
    label: 'Selected only',
    items: [
        { label: 'Show selected only', value: true }
    ]
};

const filterSelected = (items, selectedIds) => (
    items.filter((item) => (
        selectedIds.includes(item.id)
    ))
);

const useSelectedFilter = (addFilterConfigItem, selectedIds) => {
    const filterItem = {
        ...SELECTED_FILTER,
        filter: (items) => (
            filterSelected(items, selectedIds)
        )
    };

    if (addFilterConfigItem) {
        addFilterConfigItem(filterItem);
    }
};

const useBulkSelect = ({
    onSelect,
    items: propItems,
    filter,
    addFilterConfigItem,
    paginate: {
        paginator
    } = {},
    sorter,
    preselectedIds,
    selectFilter = false
} = {}) => {
    const [ selectedIds, setSelectedItemIds ] = useState(preselectedIds || []);
    useSelectedFilter(selectFilter ? addFilterConfigItem : undefined, selectedIds);

    const items = sorter ? sorter(propItems) : propItems;
    const total = items.length;

    const selectedItems = filterSelected(items, selectedIds);
    const selectedItemsTotal = selectedItems.length;
    const noneSelected = selectedItemsTotal === 0;

    const filteredItems = filter ? filter(items) : items;
    const filteredTotal = filteredItems.length;
    const filtered = filteredTotal < total;
    const allFiltertedSelected = allItemsIncluded(itemIds(filteredItems), selectedIds);

    const paginatedItems = paginator ? paginator(filteredItems) : filteredItems;
    const paginatedTotal = paginatedItems.length;

    const currentPageSelected = checkCurrentPageSelected(
        itemIds(paginatedItems), selectedIds
    );

    const allSelected = selectedItemsTotal === total;
    const title = compileTitle(selectedItemsTotal);
    const checked = checkboxState(selectedItemsTotal, total);

    const onSelectCallback = (func) => {
        const newSelectedItems = filterSelected(items, func());
        onSelect && onSelect(newSelectedItems);
    };

    const selectNone = () => onSelectCallback(() => {
        setSelectedItemIds([]);
        return [];
    });

    const selectOne = (_, selected, key, row) => onSelectCallback(() => {
        const newItemIds = selected ?
            [ ...selectedIds, row.itemId ] :
            selectedIds.filter((rowId) => (rowId !== row.itemId));

        setSelectedItemIds(newItemIds);

        return newItemIds;
    });

    const selectPage = () => onSelectCallback(() => {
        const currentPageIds = itemIds(paginatedItems);
        const newItemIds = currentPageSelected ? selectedIds.filter((itemId) => (
            !currentPageIds.includes(itemId)
        )) : mergeArraysUniqly(selectedIds, currentPageIds);
        setSelectedItemIds(newItemIds);

        return newItemIds;
    });

    const selectFiltered = () => {
        const currentFilteredIds = itemIds(filteredItems);
        const newItemIds = allFiltertedSelected ? selectedIds.filter((itemId) => (
            !currentFilteredIds.includes(itemId)
        )) : mergeArraysUniqly(selectedIds, currentFilteredIds);
        setSelectedItemIds(newItemIds);

        return newItemIds;
    };

    const selectFilteredOrAll = () => (
        filtered ? selectFiltered() : setSelectedItemIds(
            itemIds(items)
        )
    );

    const selectAll = () => onSelectCallback(() => (
        allSelected ? selectNone() : selectFilteredOrAll()
    ));

    const onSelectBulkSelect = selectPage;

    const allCount = filtered ? filteredTotal : total;

    const selectItemTransformer = (item) => ({
        ...item,
        rowProps: {
            selected: selectedIds.includes(item.itemId)
        }
    });

    const clearSelection = () => setSelectedItemIds([]);

    return {
        transformer: selectItemTransformer,
        tableProps: {
            onSelect: paginatedTotal > 0 ? selectOne : undefined,
            canSelectAll: false
        },
        clearSelection,
        toolbarProps: {
            bulkSelect: {
                toggleProps: { children: [ title, ' ' ] },
                isDisabled: paginatedTotal === 0,
                items: [{
                    title: 'Select none',
                    onClick: selectNone,
                    props: {
                        isDisabled: noneSelected
                    }
                }, {
                    title: `${ selectOrUnselect(currentPageSelected) } page ${ paginatedTotal }`,
                    onClick: selectPage
                }, {
                    title: `${ selectOrUnselect(allSelected) } all ${ allCount }`,
                    onClick: selectAll
                }],
                checked,
                onSelect: paginatedTotal > 0 ? () => onSelectBulkSelect() : undefined
            }
        }
    };
};

export default useBulkSelect;
