/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import * as reactRouterDom from 'react-router-dom';
import {
  Table as PfTable,
  SortByDirection,
  TableBody,
  TableGridBreakpoint,
  TableHeader,
  TableVariant,
  cellWidth,
  expandable,
  sortable,
} from '@patternfly/react-table';

console.error('"useInventory" hook is deprecated and will be removed in v4. Please use Chrome 2.0 compatible Inventory version.');
export const useInventory = ({
  store,
  tableReducer,
  detailReducer,
  getRegistry,
}: {
  store: any;
  tableReducer: any;
  detailReducer: any;
  getRegistry: any;
}) => {
  let cleanupCallback: () => void;
  const [inventory, setInventory] = useState({
    newReducers: null as any,
    rawReducers: null as any,
  });

  const [inventoryComponents, setInventoryComponents] = useState({
    InventoryTable: null as any,
    InventoryDetail: null as any,
    TagWithDialog: null as any,
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
        cleanupCallback = registry?.register?.(newReducers);
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
      if (cleanupCallback && typeof cleanupCallback === 'function') {
        cleanupCallback();
      }
    };
  }, []);
  return {
    ...inventory,
    ...inventoryComponents,
  };
};

export default useInventory;
