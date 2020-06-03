import React, { Fragment } from 'react';
import InventoryDetail from './InventoryDetail';
import AppInfo from './AppInfo';

export const FullDetail = (props) => (
    <Fragment>
        <InventoryDetail { ...props } />
        <AppInfo />
    </Fragment>
);

export default FullDetail;
