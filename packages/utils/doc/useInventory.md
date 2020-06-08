## Inventory hook

If you are using newer version of react, you can use hook that comes with this package to load inventory and reducers.

```JSX
import React, { useEffect, useState, Fragment } from 'react';
import { useStore } from 'react-redux';
import { useInventory } from '@redhat-cloud-services/frontend-components-utilities/files/useInventory';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

const MyCmp = () => {
    const [ConnectedInventory, setInventory] = useState();
    const { InventoryTable, newReducers } = useInventory({
        tableReducer: entitiesReducer,
        store: useStore()
    });

    useEffect(() => {
        if (InventoryTable && newReducers) {
            getRegistry().register(newReducers);
            setInventory(() => InventoryTable);
        }
    }, [InventoryTable, newReducers]);

    return (
        <Fragment>
            {ConnectedInventory && <ConnectedInventory />}
        </Fragment>
    );

}
```

#### `useInventory` accepts object with

* `store` - react redux store
* `tableReducer` - function called to create table reducers, it will be called with all inventory action types. So you can change state based on some inv events.

* `detailReducer` - function called to create detail reducers, it will be called with all inventory action types. So you can change state based on some inv events.

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
