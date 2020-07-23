import React from 'react';
import { AppInfo, InventoryDetail, FullDetail } from './components/detail';
import { TagWithDialog, RenderWrapper } from './shared';
import { InventoryTable } from './components/table';
import * as inventoryFitlers from './components/filters';

export function inventoryConnector(store, componentsMapper) {
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
                cmp={ InventoryDetail }
            />
        ),
        InventoryDetail: React.forwardRef(
            (props, ref) => <RenderWrapper
                { ...props }
                {...componentsMapper}
                inventoryRef={ ref }
                store={ store }
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
        ...inventoryFitlers
    };
}
