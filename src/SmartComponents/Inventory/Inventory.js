import React from 'react';
import { Route, Switch } from 'react-router-dom';
import routerParams from '../../Utilities/RouterParams';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';

const InventoryTable = ({ items = [], pathPrefix = 0, apiBase, showHealth, ...props }) => (
    <InventoryList
        { ...props }
        items={ items }
        pathPrefix={ pathPrefix }
        apiBase={ apiBase }
        showHealth={ showHealth }
    />
);

const InventoryItem = ({ root, pathPrefix = 0, apiBase, ...props }) => (
    <InventoryDetail { ...props } root={ root } pathPrefix={ pathPrefix } apiBase={ apiBase } />
);

const Inventory = ({ match, noTable = false, items = [], pathPrefix = 0, apiBase }) => {
    return (
        <Switch>
            {
                !noTable &&
                <Route exact path={ match.url } render={ props => (
                    <InventoryTable { ...props } items={ items } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                ) } />
            }
            <Route path={ `${match.url}${match.url.substr(-1, 1) === '/' ? '' : '/'}:inventoryId` }
                render={ props => (
                    <InventoryItem { ...props } root={ match.url } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                ) }
            />
        </Switch>
    );
};

export default routerParams((Inventory));

export function inventoryConnector() {
    return {
        InventoryTable,
        InventoryDetail: InventoryItem,
        Inventory: routerParams(Inventory)
    };
}
