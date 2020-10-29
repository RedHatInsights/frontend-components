# Inventory
This component is designed to show list of all entities in static inventory and allow them to navigate to detail of
each entity. In such detail user will see some basic static data alongside custom application details.

This component is hot loaded via chrome, so any changes made to it will be automatically pulled by any application that uses it.

# Notice!
**When using system detail do not use `Route` set to `exact`. It is designed as partial component and app details of inventory is loaded in same view so it will break if not used in non-exact mode.**

You will need to register two routes (one for inventory table the other one for inventory detail) in this way
```JSX
<Route exact path={'some/path/:itemId'} component={ItemPage} />
<Route path={'some/path/:itemId/:inventoryId'} component={InventoryPage} />
```

Where `ItemPage` contains `InventoryTable` and `InventoryPage` has inventory detail. If back button is not working correctly you might want to consider adding `root` to Inventory detail so it picks correct props and maps them to URL.

**These examples count on using insight's registry, if you are using different make sure that you pass along correct one and don't use `registryDecorator`**

## Usage of hot loading
To load such inventory via chrome just call `window.insights.loadInventory` with dependencies and wait for it to load all data.

**If you want to use new version of react-redux with hooks you have to change the way how you load the inventory to pass your store to it `inventoryConnector(store)`, where store is your redux store.**

Expected dependencies is object with shape:
```JS
{
    react: React, //Whole react
    reactRouterDom: reactRouterDom //React router dom { withRouter, Switch, Route, Redirect, Link } are required
    reactIcons: reactIcons //PF icons { TimesIcon, SyncIcon, hieldAltIcon, DollarSignIcon, WrenchIcon, CertificateIcon } are required, but they might be changed and more will be needed in future
    reactCore: reactCore //PF react core items, best is to import * and pass whole reactCore
    pfreact: pfreact // PF 3 react components - PaginationRow is currently used
}
```

To load inventory table use like this:

```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { PaginationRow } from 'patternfly-react';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        }

        this.fetchInventory();
    }

    async fetchInventory() {
        const { inventoryConnector, mergeWithEntities } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithEntities()
        });

        this.setState({
            // if you are going to use newer version of react-redux pass store to this function
            // InventoryCmp: inventoryConnector(store).InventoryTable
            // where `store` is your redux store - https://react-redux.js.org/api/provider#props
            InventoryCmp: inventoryConnector().InventoryTable
        })
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <InventoryCmp />
        )
    }
}
```

To show inventory detail use it like this:
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { PaginationRow } from 'patternfly-react';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        }

        this.fetchInventory();
    }

    async fetchInventory() {
        const { inventoryConnector, mergeWithDetail } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithDetail()
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryDetail
        })
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <InventoryCmp root={'some/url/:someId'}/>
        )
    }
}
```

You'll have to also register inventory reducers so the data are fetched correctly that is represent by calling 
`this.getRegistry().register` with `mergeWithEntities` and `mergeWithDetail`.

* react-redux with hooks
```JSX
import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux'
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import * as reactRouterDom from 'react-router-dom';
import register from '../redux/store';

const SomeCmp = () => {
    const [ InventoryCmp, setInventory ] = useState(<div>Loading...</div>);
    const store = useStore()
    const loadInventory = async () => {
        const { inventoryConnector, mergeWithEntities } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable
        });

        this.getRegistry().register({
            ...mergeWithEntities()
        });

        setInventory(inventoryConnector(store).InventoryTable);
    };

    useEffect(() => {
        loadInventory();
    }, []);

    return <InventoryCmp />
}
```

## Usage variants
With inventory component loaded same as in previous step we have couple of variants of how to use this component

1) Passing array of prefetched items from different data source - if you want to fetch inventory information from another source and help inventory to fetch facts for only those items you can pass either array of (string) IDs or objects with ID and additional props.

```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { PaginationRow } from 'patternfly-react';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { hostData } from './api';

@registryDecorator()
class SomeCmp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            InventoryCmp: () => (<div>Loading...</div>)
        }

        this.fetchInventory();
    }

    async fetchInventory() {
        // This can be data from server, redux data or just plain object.  
        const hostEntities = await hostData(); // from server
        // const hostEntities = this.props.hostEntities // from redux
        // const hostEntities = [{ id: '12-56-r-g', some: 'another', myData: 'something specific' }] // objects with ID
        // cons hostEntities = [ '12-56-r-g' ] // array with IDs
        const { inventoryConnector, mergeWithEntities } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithEntities()
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable,
            hostEntities: hostEntities
        })
    }

    render() {
        const { InventoryCmp, hostEntities } = this.state;
        return (
            <InventoryCmp items={ hostEntities } />
        )
    }
}
```

2) Calling some action when all entities are loaded - if you want to do something with fetched data, callback function will receive argument with shape `{data: data, stopBubble: () => boolean}`, where data is Promise with fetched data and stopBubble prevents from bubling to store.
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { PaginationRow } from 'patternfly-react';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    //...
    async fetchInventory() {
        const { inventoryConnector, mergeWithEntities} = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithEntities()
        });

        this.entitiesListener = addNewListener({
            actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITIES,
            callback: this.callSomeFunction
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryTable
        })
    }

    callSomeFunction({ data }) {
        //Do something with data Promise
    }
    //...
}
```

3) Calling some action when entity detail is loaded - if you want to get the ID of entity callback function will receive argument with promise with shape `{data: data, stopBubble: () => boolean}`, where data is Promise with ID of selected item and fetched data, stopBubble prevents from bubling to store.
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { PaginationRow } from 'patternfly-react';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
  //...
    async fetchInventory() {
        const { inventoryConnector, mergeWithDetail, INVENTORY_ACTION_TYPES } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReact: { PaginationRow }
        });

        this.getRegistry().register({
            ...mergeWithDetail()
        });

        this.entityListener = addNewListener({
            actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITY,
            callback: this.callSomeOtherFunction
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryDetail
        });
    }

    callSomeOtherFunction({ data }) {
      //Do something with data Promise
    }
  //...
}
```

### InventoryTable as tree
Since inventory table is regular table you can pass additional data to it to be rendered as tree table with collapsible rows and some specific data in such row.

To show some collapsed information you can pass children prop for each item. This children can be either string or function with React children in it.

Once user clicks on expand button you will be notified over `onExpandClick` callback. 
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            InventoryCmp: () => <div>Loading...</div>,
            items: [{
                id: 'some-id',
                children: () => <div>Something</div>
            }]
        }
        this.onExpandClick = this.onExpandClick.bind(this);
        this.fetchInventory();
    }

    async fetchInventory() {
        const { inventoryConnector, mergeWithEntities } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable
        });

        this.getRegistry().register({
            ...mergeWithEntities()
        });

        const { InventoryTable, updateEntities } = inventoryConnector();
        this.updateEntities = updateEntities;

        this.setState({
            InventoryCmp: InventoryTable
        })
    }

    render() {
        const { InventoryCmp, items } = this.state;
        const { onCollapse } = this.props;
        return (
            <InventoryCmp
                items={items}
                expandable
                onExpandClick={(_e, _i, isOpen, { id }) => expandItem(isOpen, id)}
            />
        )
    }
}

SomeCmp.contextTypes = {
   store: propTypes.object
};

export default connect((dispatch) => ({
    onCollapse: (isOpen, id) => dispatch({ type: 'EXPAND', payload: { id, isOpen } })
})() => ({}))(SomeCmp);
```

### Compact table
If you want to include inventory table in smaller area you can pass attribute `variant` it is the same as in [PF4 table](http://patternfly-react.surge.sh/patternfly-4/components/table#Table)
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    //...
    render() {
        const { InventoryCmp, items } = this.state;
        return (
            <InventoryCmp variant={reactCore.TableVariant.compact} />
        )
    }
}
```
### Refresh on change (for example on filter)
When user wants to update table, filter data (both trough filter select and textual filter) or you want to update visible items you can either update data in redux or use inventory ref and `onRefreshData` function.

```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);
        this.inventory = React.createRef();
        this.state = {
            InventoryCmp: () => <div>Loading...</div>,
            items: [] // some data
        }
        this.fetchInventory();
    }

    async fetchInventory() {
        // ..
    }

    onRefresh(options) {
        // Do something with this.state items and refresh data trough onRefreshData function
        this.inventory.current && this.inventory.current.onRefreshData();
    }

    render() {
        const { InventoryCmp, items } = this.state;
        return (
            <InventoryCmp items={items} ref={this.inventory} onRefresh={this.onRefresh} />
        )
    }
}
```

### Application pagination
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    constructor(props, ctx) {
        // ..
        // initial data can be static or from server
        this.state = {
            // ..
            InventoryCmp: () => <div>Loading...</div>,
            page: 1,
            perPage: 25
        }
    }

    async fetchInventory() {
        // ..
    }

    onRefresh = (options) => {
        // This will be called when user clicks on pagination
        // Do something with these information
        fetch(`/some/endpoint?page=${options.page}&count=${options.perPage}`).then(data => {
            data.json().then(({ items, meta }) => {
                this.setState({
                    items,
                    total: meta.total,
                    page: meta.page,
                    perPage: meta.count
                });
            });
        });
    }

    render() {
        const { InventoryCmp, items, page, perPage, total } = this.state;
        return (
            <InventoryCmp items={items} onRefresh={this.onRefresh} page={page} perPage={perPage} total={total} />
        )
    }
}
```

### Additional filtering
Inventory has some basic filters over name, system type and OS version. However if you want to add your own filters you can do that by passing filters. Also if you want to show some extra content in header just pass children and inventory will show them next to filters and refresh.

You will be notified in `onRefresh` function about filter changes.
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    constructor(props, ctx) {
        super(props, ctx);
        this.inventory = React.createRef();
        this.state = {
            InventoryCmp: () => <div>Loading...</div>
        }
        this.fetchInventory();
    }

    async fetchInventory() {
        // ..
    }

    // options: { page, per_page, filters }
    onRefresh(options) {
        // do something with options
    }

    render() {
        const { InventoryCmp } = this.state;
        return (
            <InventoryCmp ref={this.inventory} filters={[
                { title: 'Some filter', value: 'some-filter', items: [{ title: 'First', value: 'first' }] }
            ]} onRefresh={this.onRefresh}/>
        )
    }
}
```

### Using RBAC with inventory

By default inventory component will check `['inventory:*:*', 'inventory:*:read', 'inventory:hosts:read']` in RBAC. If any is found it means that the user has access to inventory host list and will show either container view or full page view.

If you are using just inventory table in your screen please pass `isFullView={true}` to connected inventory component so the component will render in full page view instead of container view.

### Changing list of entities
If you want to change list of entities you should change them in redux store so the changes are reflected in entity table automatically.

Function `mergeWithEntities` accepts redux reducer (function wwhich in simplest way can look like `(state) => state`), just to be clear reducer function accepts `state` and `payload` as parameter and return either unchanged state or state which is changed
based on payload.

You'll want to split the reducers from your app logic in our example we have all reducers stored under `src/store/reducers`, but your application can have them anywhere you want.

If you are going to change rows or entities in store, please use `mergeArraysByKey` function which helps you with merging both current state and new payload together so you don't loose any of it.
* `src/store/reducers.js` - let's use `applyReducerHash` to demonstrate how to use such function
```JS
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import { ACTION_TYPES } from '../constants';
export const listReducer = applyReducerHash({
  [ACTION_TYPES.GET_ENTITIES_FULFILLED]: (state, payload) => {
    //do some logic with state
    return {...state};
  }
})
```

* `src/SomeComponent.js` - this is our example component
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { listReducer } from './store/reducers';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
  //...
  async fetchInventory() {
    const { inventoryConnector, mergeWithEntities, INVENTORY_ACTION_TYPES } = await insights.loadInventory({
      react: React,
      reactRouterDom,
      reactCore,
      reactIcons,
      pfReactTable
    });

    this.getRegistry().register({
      ...mergeWithEntities(listReducer)
    });

    this.entityListener = addNewListener({
        actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITY,
        callback: this.props.fetchEntities
        }
    });

    this.setState({
      InventoryCmp: inventoryConnector().InventoryTable
    })
  }
  //...
}
```

### Changing detail
If you want to change detail of selected entity you should change it in redux store so the changes are reflected in entity detail automatically.

Function `mergeWithDetail` accepts redux reducer (function wwhich in simplest way can look like `(state) => state`), just to be clear reducer function accepts `state` and `action` as parameter and return either unchanged state or state which is changed
based on action's payload.

You'll want to split the reducers from your app logic in our example we have all reducers stored under `src/store/reducers`, but your application can have them anywhere you want.

* `src/store/reducers.js` - let's switch and also inventory action to demonstrate such usage
```JS
import { ACTION_TYPES } from '../constants';
export function entityDetailReducer(INVENTORY_ACTIONS) {
  return function(state, action) {
    switch(action.type) {
      case INVENTORY_ACTIONS.LOAD_ENTITY_FULFILLED: {
        // do some thing with entity
        return {...state}
      }
      case ACTION_TYPES.GET_ENTITY_FULFILLED: {
        // do some thing with entity
        return {...state}
      }
    }
  }
}
```

* `src/SomeComponent.js` - this is our example component
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import * as pfReactTable from '@patternfly/react-table';
import { entityDetailReducer } from './store/reducers';
import registryDecorator from '@redhat-cloud-services/frontend-components-utilities/files/Registry';

@registryDecorator()
class SomeCmp extends React.Component {
    //...
    async fetchInventory() {
        const {
            inventoryConnector,
            mergeWithDetail,
            INVENTORY_ACTION_TYPES
        } = await insights.loadInventory({
            react: React,
            reactRouterDom,
            reactCore,
            reactIcons,
            pfReactTable
        });

        this.getRegistry().register({
            ...mergeWithDetail(entityDetailReducer(INVENTORY_ACTION_TYPES))
        });

        this.entityListener = addNewListener({
            actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITY,
            callback: this.props.fetchEntities
            }
        });

        this.setState({
            InventoryCmp: inventoryConnector().InventoryDetail
        })
    }
  //...
}
```

### Add custom app entity detail
If you want to display some information in entity detail you have option to do so, by adding details to store based on your application.

We'll use our reducers file and add some application to it
```JS
import { Overview } from '@redhat-cloud-services/frontend-components';

function enableApplications(state) {
  return {
    ...state,
    loaded: true,
    activeApps: [
      { title: 'Overview', name: 'overview', component: Overview },
      { title: 'Vulnerabilities', name: 'vulnerabilities' },
    ]
  }
}

export function entitesDetailReducer(INVENTORY_ACTION_TYPES) {
    return applyReducerHash(
        {
            [INVENTORY_ACTION_TYPES.LOAD_ENTITY_FULFILLED]: enableApplications,
        },
        defaultState
    );
}
```
The most iportant part over here is the part of state `activeApps` which requires array of objects with `title` this will be displayed as tab, `name` this is to correctly navigate in router and `component` is optional with component which will be displayed as tab content.


### Custom props to column
Sometimes you might want to change size of each column to style the table properly. You can do this by adding `props` to columns
```JS
import { ACTION_TYPES } from '../constants';
export function entityDetailReducer(INVENTORY_ACTIONS) {
  return function(state, action) {
    switch(action.type) {
      case INVENTORY_ACTIONS.LOAD_ENTITY_FULFILLED: {
        state.columns = [
            {
                key: 'some.compliacated.key',
                title: 'Some title',
                props: {
                    width: 40
                }
            }, {
                key: 'simple',
                title: 'Another',
                props: {
                    width: 10
                }
            }
        ]
        return {...state}
      }
    }
  }
}
```

**Please write these application specific details in some place where others can benefit from your implementation.**

## Inventory actions
These actions are fired from inventory component. If action is marked with `*` it means it's async actions and so it has `_FULFILLED`, `_PENDING` and `_REJECTED` variants.
* `LOAD_ENTITIES` - to trigger fetching entities from specific endpoint
* `LOAD_ENTITY` - when detail data are being received from server
* `SELECT_ENTITY` - if user clicks on checkbox in entity list
* `CHANGE_SORT` - when user changes sort
* `FILTER_ENTITIES` - when user wants to filter entities
* `APPLICATION_SELECTED` - fired after user clicks on application detail

## Store shape
As mentioned before the async loader will load two functions `mergeWithEntities` and `mergeWithDetail` both have access to your store and they will create specific keys in store. Please do not change the data directly, since that can break the inventory component.

Let's assume that the store looks like
```JS
{
  someKey: {}
}
```

### Entities key
Given store will look like
```JS
{
    someKey: {},
    entities: {
        columns: Array({key: String, title: String, composed: Array(String)})
        loaded: Boolean
        rows: Array({}),
        entities: Array({})
    }
}
```
* columns - each entry has `key`, `title` and `composed`. Composed is array of paths for multiple values, `key` is path to display value.
* loaded - if data are loaded to indicate loading.
* rows - contains actual data. Based on columns the data will be queried by `key` or `composed` and shown in table. If no data are found `unknown` will be shown for such column.
* entities - is just copy of rows which are filtered and sorted.

### EntityDetails key
```JS
{
    someKey: {},
    entityDetails: {
        activeApp: {appName: String},
        activeApps: Array({title: String, name: String, component: React.Component}),
        entity: {},
        tags: {key: Array(String)}
    }
}
```
* activeApp - name of active app.
* activeApps - array with visible apps, `title` will be tab title, `name` will be used for react router and `component` as tab content.
* entity - actual entity data. 
  * Hostname: `display_name`
  * UUID: `facts.host_system_id`
  * System: `facts.release`
  * Last Check-in: TODO
  * Registered: TODO
* tags - tags data

