## (deprecated) Inventory hook

Inventory hook is replaced by inventory federated module in chrome 2.0 and forwards.

If you are using newer version of react, you can use hook that comes with this package to load inventory and reducers.

```JSX
import React, { Fragment } from 'react';
import { useStore } from 'react-redux';
import { useInventory } from '@redhat-cloud-services/frontend-components-utilities/useInventory';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import { entitiesReducer } from './redux/reducers/table';

const MyCmp = () => {
    const { InventoryTable } = useInventory({
        tableReducer: entitiesReducer,
        getRegistry
    });

    return (
        <Fragment>
            {InventoryTable && <InventoryTable />}
        </Fragment>
    );
}
```

#### `useInventory` accepts object with

* `getRegistry` - registry to be used to include newly created reducers from inventory
* `store` - react redux store, by default it is expected that `getRegistry` has method `getStore` if it does not have such method, please pass in your redux store to this hook.
* `tableReducer` - redux reducer function called to create table reducers, it will be called with all inventory action types. So you can change state based on some inv events.
* `detailReducer` - redux reducer function called to create detail reducers, it will be called with all inventory action types. So you can change state based on some inv events.

#### Example of reducer callback:

```JS
{
    tableReducer: (INVENTORY_ACTION_TYPES) => applyReducerHash(
        {
            [INVENTORY_ACTION_TYPES.LOAD_ENTITIES_PENDING]: (state) => ({
                ...state,
                inventoryLoading: true
            })
        },
        defaultState
    )
}
```

#### `useInventory` returns object
* InventoryDetail - detail components (`InventoryDetailHead`, `AppInfo` and `InventoryDetail`)
* InventoryTable - table component
* TagWithDialog - tags component
* newReducers - reducers to be registered in your store
* rawReducers - if you want to change how reducers are merged together here will be `mergeWithEntities` and `mergeWithDetail`

#### Custom register and Inv component

If you want to change the reducer that has been calculated or you want to assign component created from hook to your own state prop:

```JSX
import React, { useEffect, useState, Fragment } from 'react';
import { useStore } from 'react-redux';
import { useInventory } from '@redhat-cloud-services/frontend-components-utilities/files/useInventory';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { entitiesReducer } from './redux/reducers/table';

const MyCmp = () => {
    const [ ConnectedInventory, setConnectedInventory ] = useState(null);
    const store = useStore();
    const { InventoryTable, newReducers } = useInventory({
        tableReducer: entitiesReducer,
        store
    });

    useEffect(() => {
        if (newReducers) {
            // do something with reducers or InventoryTable
            // don't forget to register newReducers in your redux!
            // for example `store.replaceReducers(newReducers);`
            setConnectedInventory(InventoryTable);
        }
    }, [newReducers])

    return (
        <Fragment>
            {ConnectedInventory && <ConnectedInventory />}
        </Fragment>
    );

}
```
