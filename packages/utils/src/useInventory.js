import { useState, useEffect } from 'react';
import * as reactRouterDom from 'react-router-dom';
import {
    Table as PfTable,
    TableBody,
    TableHeader,
    TableGridBreakpoint,
    cellWidth,
    TableVariant,
    sortable,
    expandable,
    SortByDirection
} from '@patternfly/react-table';

export function useInventory({
    store,
    tableReducer,
    detailReducer
}) {
    const [ inventory, setInventory ] = useState({
        InventoryTable: null,
        InventoryDetail: null,
        TagWithDialog: null,
        newReducers: null,
        rawReducers: null
    });

    useEffect(() => {
        (async () => {
            const {
                inventoryConnector,
                INVENTORY_ACTION_TYPES,
                mergeWithDetail,
                mergeWithEntities
            } = await insights.loadInventory({
                reactRouterDom,
                pfReactTable: {
                    Table: PfTable,
                    TableBody,
                    TableHeader,
                    TableGridBreakpoint,
                    cellWidth,
                    TableVariant,
                    sortable,
                    expandable,
                    SortByDirection
                }
            });
            let newReducers = {};
            if (tableReducer) {
                newReducers = {
                    ...newReducers,
                    ...mergeWithEntities(tableReducer(INVENTORY_ACTION_TYPES))
                };
            }

            if (detailReducer) {
                newReducers = {
                    ...newReducers,
                    ...mergeWithDetail(detailReducer(INVENTORY_ACTION_TYPES))
                };
            }

            const {
                InventoryDetailHead,
                AppInfo,
                InventoryTable,
                InventoryDetail,
                TagWithDialog
            } = inventoryConnector(store);
            setInventory(() => ({
                InventoryDetail: {
                    InventoryDetailHead,
                    AppInfo,
                    InventoryDetail
                },
                InventoryTable,
                TagWithDialog,
                newReducers,
                rawReducers: {
                    mergeWithEntities,
                    mergeWithDetail
                }
            }));
        })();
    }, []);
    return inventory;
}
