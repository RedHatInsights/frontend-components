import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routerParams from '../../Utilities/RouterParams';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';

const Inventory = ({ match, noTable = false }) => {
    return (
        <Switch>
            { !noTable && <Route exact path={ match.url } component={ InventoryList } /> }
            <Route path={ `${match.url}/:inventoryId` } render={ props => <InventoryDetail { ...props } root={ match.url } /> } />
        </Switch>
    );
};

export default routerParams((Inventory));

export function inventoryConnector() {
    return routerParams(Inventory);
}
