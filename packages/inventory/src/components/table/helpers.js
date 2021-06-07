import React from 'react';
import { cellWidth, sortable, expandable } from '@patternfly/react-table';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import TitleColumn from './TitleColumn';
import { Fragment } from 'react';

export const buildCells = (item, columns, extra) => {
    return columns.map(({ key, composed, renderFunc }) => {
        const data = composed ? <Fragment>{TitleColumn(
            composed.map(key => get(item, key, ' ')),
            item.id,
            item,
            extra
        )}</Fragment> : get(item, key, ' ');
        return renderFunc ? <Fragment>{ renderFunc(data, item.id, item, extra) }</Fragment> : data;
    });
};

export const createRows = (rows = [], columns = [], { actions, expandable, noSystemsTable, ...extra } = {}) => {
    if (rows.length === 0) {
        return [{
            cells: [{
                title: noSystemsTable,
                props: {
                    colSpan: columns.length + Boolean(actions)
                }
            }]
        }];
    }

    return flatten(rows.map((oneItem, key) => ([{
        ...oneItem,
        ...oneItem.children && expandable && { isOpen: !!oneItem.isOpen },
        cells: buildCells(oneItem, columns, extra),
        actionProps: {
            'data-ouia-component-id': `${oneItem.id}-actions-kebab`
        }
    }, oneItem.children && expandable && {
        cells: [
            {
                title: typeof oneItem.children === 'function' ? oneItem.children() : oneItem.children
            }
        ],
        parent: key * 2,
        fullWidth: true
    } ]))).filter(Boolean);
};

export const onDeleteFilter = (deleted, currFilter) => {
    const { value: deletedItem } = deleted?.chips?.[0] || {};
    const newFilter = currFilter.filter((item) => item !== deletedItem);
    return newFilter;
};

export const onDeleteTag = (deleted, selectedTags, onApplyTags) => {
    const deletedItem = deleted?.chips?.[0];
    if (selectedTags?.[deleted?.key]?.[deletedItem?.key] !== undefined) {
        selectedTags[deleted?.key][deletedItem?.key] = false;
    }

    onApplyTags && onApplyTags(selectedTags, false);
    return selectedTags;
};

const includesSortable = (transforms) => transforms?.reduce((acc, fn) => acc || fn.toString().includes('onSort:'), false);

export const createColumns = (columns, hasItems, rows, isExpandable) => (
    columns?.map(({ props, transforms, cellFormatters, ...oneCell }) => ({
        ...oneCell,
        transforms: [
            ...transforms || [],
            ...props?.width ? [ cellWidth(props.width) ] : [],
            ...hasItems || rows.length <= 0 || (props && props.isStatic) || transforms?.includes(sortable) || includesSortable(transforms) ? [] : [ sortable ]
        ],
        cellFormatters: [
            ...cellFormatters || [],
            ...isExpandable ? [ expandable ] : []
        ]
    }))
);
