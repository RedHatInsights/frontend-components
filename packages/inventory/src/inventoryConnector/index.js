/* eslint-disable react/display-name */
import React from 'react';
import { AppInfo, InventoryDetail, FullDetail } from '../components/detail';
import { TagWithDialog, RenderWrapper } from '../shared';
import { InventoryTable } from '../components/table';
import * as inventoryFitlers from '../components/filters';
import DetailRenderer from '../components/detail/DetailRenderer';

export function inventoryConnector(store, componentsMapper, Wrapper, isRbacEnabled = true) {
  const showInventoryDrawer = Boolean(Wrapper);
  return {
    InventoryTable: React.forwardRef((props, ref) => (
      <RenderWrapper {...props} isRbacEnabled={isRbacEnabled} inventoryRef={ref} store={store} cmp={InventoryTable} />
    )),
    AppInfo: React.forwardRef((props, ref) => (
      <RenderWrapper hideLoader {...props} {...componentsMapper} isRbacEnabled={isRbacEnabled} inventoryRef={ref} store={store} cmp={AppInfo} />
    )),
    InventoryDetailHead: React.forwardRef((props, ref) => (
      <RenderWrapper
        hideLoader
        {...props}
        {...componentsMapper}
        isRbacEnabled={isRbacEnabled}
        inventoryRef={ref}
        store={store}
        // eslint-disable-next-line react/prop-types
        showInventoryDrawer={showInventoryDrawer && !props.hideInvDrawer}
        cmp={InventoryDetail}
      />
    )),
    InventoryDetail: React.forwardRef((props, ref) => (
      <RenderWrapper
        hideLoader
        {...props}
        {...componentsMapper}
        isRbacEnabled={isRbacEnabled}
        inventoryRef={ref}
        store={store}
        showInventoryDrawer={showInventoryDrawer}
        cmp={FullDetail}
      />
    )),
    TagWithDialog: React.forwardRef((props, ref) => (
      <RenderWrapper {...props} inventoryRef={ref} isRbacEnabled={isRbacEnabled} store={store} cmp={TagWithDialog} />
    )),
    // eslint-disable-next-line react/display-name
    DetailWrapper: (props) => <DetailRenderer Wrapper={Wrapper} isRbacEnabled={isRbacEnabled} showInventoryDrawer={showInventoryDrawer} {...props} />,
    ...inventoryFitlers,
  };
}
