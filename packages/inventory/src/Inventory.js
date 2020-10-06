import React from 'react';
import { AppInfo, InventoryDetail, FullDetail, DetailWrapper } from './components/detail';
import { TagWithDialog, RenderWrapper } from './shared';
import { InventoryTable } from './components/table';
import * as inventoryFitlers from './components/filters';
import DetailRenderer from './components/detail/DetailRenderer';

export function inventoryConnector(store, componentsMapper, Wrapper) {
    const showInventoryDrawer = Boolean(Wrapper);
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
                hideLoader
                { ...props }
                {...componentsMapper}
                inventoryRef={ ref }
                store={ store }
                cmp={ AppInfo }
            />
        ),
        InventoryDetailHead: React.forwardRef(
            (props, ref) => <RenderWrapper
                hideLoader
                { ...props }
                {...componentsMapper}
                inventoryRef={ ref }
                store={ store }
                showInventoryDrawer={ showInventoryDrawer && !props.hideInvDrawer }
                cmp={ InventoryDetail }
            />
        ),
        InventoryDetail: React.forwardRef(
            (props, ref) => <RenderWrapper
                hideLoader
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
        DetailWrapper: DetailRenderer,
        ...inventoryFitlers
    };
}
