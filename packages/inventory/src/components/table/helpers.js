import React from 'react';
import NoSystemsTable from './NoSystemsTable';
import get from 'lodash/get';

export const buildCells = (item, columns, extra) => {
    return columns
    .map(({ key, renderFunc }) => {
        const data = get(item, key, ' ');
        return renderFunc ? {
            title: renderFunc(data, item.id, item, extra)
        } : data;
    })
    .filter(cell => cell !== false && cell !== undefined);
};

export const createRows = (rows, columns, { actions, expandable, ...extra }) => {
    if (rows.length === 0) {
        return [{
            cells: [{
                title: <NoSystemsTable />,
                props: {
                    colSpan: columns.length + Boolean(actions)
                }
            }]
        }];
    }

    return rows.map((oneItem, key) => ([{
        ...oneItem,
        ...oneItem.children && expandable && { isOpen: !!oneItem.isOpen },
        cells: buildCells(oneItem, columns, extra)
    }, oneItem.children && expandable && {
        cells: [
            {
                title: typeof oneItem.children === 'function' ? oneItem.children() : oneItem.children
            }
        ],
        parent: key * 2,
        fullWidth: true
    } ])).flat().filter(Boolean);
};

export const onDeleteFilter = (deleted, currFilter) => {
    const { value: deletedItem } = deleted.chips[0];
    const newFilter = currFilter.filter((item) => item !== deletedItem);
    return newFilter;
};

export const onDeleteTag = (deleted, selectedTags, onApplyTags) => {
    const deletedItem = deleted.chips[0];
    selectedTags[deleted.key][deletedItem.key] = false;
    onApplyTags(selectedTags, false);
    return selectedTags;
};
