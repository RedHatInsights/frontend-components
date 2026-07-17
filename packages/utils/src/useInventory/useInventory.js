import { useEffect, useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
import { SortByDirection, TableGridBreakpoint, TableVariant, cellWidth, expandable, sortable } from '@patternfly/react-table';
// FIXME: Deal with table later
import { Table as PfTable, TableBody, TableHeader } from '@patternfly/react-table/deprecated';

console.error('"useInventory" hook is deprecated and will be removed in v4. Please use Chrome 2.0 compatible Inventory version.');
export const useInventory = ({ store, tableReducer, detailReducer, getRegistry }) => {
  let cleenupCallback;
  const [inventory, setInventory] = useState({
    newReducers: null,
    rawReducers: null,
  });

  const [inventoryComponents, setInventoryComponents] = useState({
    InventoryTable: null,
    InventoryDetail: null,
    TagWithDialog: null,
  });

  useEffect(() => {
    (async () => {
      let currStore = store;
      let registry;
      const { inventoryConnector, INVENTORY_ACTION_TYPES, mergeWithDetail, mergeWithEntities } = await insights.loadInventory({
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
          SortByDirection,
        },
      });

      let newReducers = {};
      if (tableReducer) {
        newReducers = {
          ...newReducers,
          ...mergeWithEntities(tableReducer(INVENTORY_ACTION_TYPES)),
        };
      }

      if (detailReducer) {
        newReducers = {
          ...newReducers,
          ...mergeWithDetail(detailReducer(INVENTORY_ACTION_TYPES)),
        };
      }

      if (getRegistry && typeof getRegistry === 'function') {
        registry = getRegistry();
      }

      if (!currStore && registry) {
        currStore = registry?.getStore?.();
      }

      const { InventoryDetailHead, AppInfo, InventoryTable, InventoryDetail, TagWithDialog } = inventoryConnector(currStore);
      setInventory(() => ({
        newReducers,
        rawReducers: {
          mergeWithEntities,
          mergeWithDetail,
        },
      }));

      if (registry) {
        cleenupCallback = registry?.register?.(newReducers);
      }

      setInventoryComponents(() => ({
        InventoryDetail: {
          InventoryDetailHead,
          AppInfo,
          InventoryDetail,
        },
        InventoryTable,
        TagWithDialog,
      }));
    })();

    return () => {
      if (cleenupCallback && typeof cleenupCallback === 'function') {
        cleenupCallback();
      }
    };
  }, []);
  return {
    ...inventory,
    ...inventoryComponents,
  };
};

export default useInventory;
