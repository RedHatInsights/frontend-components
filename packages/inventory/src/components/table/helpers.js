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

export const stateMapper = {
    setTextFilter: (state, { payload }) => ({
        ...state,
        textFilter: payload
    }),
    setSelected: (state, { payload }) => ({
        ...state,
        selected: payload
    }),
    setFilterTagsBy: (state, { payload }) => ({
        ...state,
        filterTagsBy: payload
    }),
    setStaleFilter: (state, { payload }) => ({
        ...state,
        staleFilter: payload
    }),
    setRegisteredWithFilter: (state, { payload }) => ({
        ...state,
        registeredWithFilter: payload
    }),
    batchUpdate: (state, { payload }) => ({
        ...state,
        ...payload
    })
};
