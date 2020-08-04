import React from 'react';
import { AppInfo, InventoryDetail, FullDetail, DetailWrapper } from './components/detail';
import { TagWithDialog, RenderWrapper } from './shared';
import { InventoryTable } from './components/table';
import * as inventoryFitlers from './components/filters';

export function inventoryConnector(store, componentsMapper, showInventoryDrawer) {
    return {
        InventoryTable: React.forwardRef(
            (props, ref) => <RenderWrapper
                { ...props }
                inventoryRef={ ref }
                store={ store }
                cmp={ InventoryTable }
            />
        ),
        AppInfo: React.forwardRef(
            (props, ref) => <RenderWrapper
                { ...props }
                {...componentsMapper}
                inventoryRef={ ref }
                store={ store }
                cmp={ AppInfo }
            />
        ),
        InventoryDetailHead: React.forwardRef(
            (props, ref) => <RenderWrapper
                { ...props }
                {...componentsMapper}
                inventoryRef={ ref }
                store={ store }
                showInventoryDrawer={ showInventoryDrawer }
                cmp={ InventoryDetail }
            />
        ),
        InventoryDetail: React.forwardRef(
            (props, ref) => <RenderWrapper
                { ...props }
                {...componentsMapper}
                inventoryRef={ ref }
                store={ store }
                showInventoryDrawer={ showInventoryDrawer }
                cmp={ FullDetail }
            />
        ),
        TagWithDialog: React.forwardRef(
            (props, ref) => <RenderWrapper
                { ...props }
                inventoryRef={ ref }
                store={ store }
                cmp={ TagWithDialog }
            />
        ),
        DetailWrapper: React.forwardRef(
            (props, ref) => <RenderWrapper
                { ...props }
                inventoryRef={ ref }
                store={ store }
                cmp={ DetailWrapper }
            />
        ),
        ...inventoryFitlers
    };
}
