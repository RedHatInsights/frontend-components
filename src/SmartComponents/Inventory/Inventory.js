import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routerParams from '../../Utilities/RouterParams';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';

const Inventory = ({ match, noTable = false, items = [], pathPrefix = 0, apiBase }) => {
    return (
        <Switch>
            {
                !noTable &&
                <Route exact path={ match.url } render={ props => (
                    <InventoryList { ...props } items={ items } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                ) } />
            }
            <Route path={ `${match.url}${match.url.substr(-1, 1) === '/' ? '' : '/'}:inventoryId` }
                render={ props => (
                    <InventoryDetail { ...props } root={ match.url } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                ) }
            />
        </Switch>
    );
};

export default routerParams((Inventory));

export function inventoryConnector() {
    return routerParams(Inventory);
}
