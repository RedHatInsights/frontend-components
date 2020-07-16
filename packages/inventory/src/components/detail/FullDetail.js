import React, { Fragment } from 'react';
import InventoryDetail from './InventoryDetail';
import AppInfo from './AppInfo';

/**
 * Fallback component that binds together App info and inventory Detail.
 * You should not use this component unless you know what you are doing.
 * @param {*} props any parent props, just passed to InventoryDetail and AppInfo.
 */
export const FullDetail = (props) => (
    <Fragment>
        <InventoryDetail { ...props } />
        <AppInfo { ...props } />
    </Fragment>
);

export default FullDetail;
