import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';

const Inventory = ({ match, noTable = false }) => {
    return (
        <Switch>
            { !noTable && <Route exact path={ match.path } component={ InventoryList } /> }
            <Route path={ `${match.path}/:id` } render={ props => <InventoryDetail { ...props } root={ match.path } /> } />
        </Switch>
    );
};

export default withRouter((Inventory));

export function inventoryConnector() {
    return withRouter(Inventory);
}
