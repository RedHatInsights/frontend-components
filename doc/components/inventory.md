# Inventory
This component is designed to show list of all entities in static inventory and allow them to navigate to detail of
each entity. In such detail user will see some basic static data alongside custom application details.

This component is hot loaded via chrome, so any changes made to it will be automatically pulled by any application that uses it.

# Notice!
**When using this application do not use `Route` set to `exact`. It is designed as partial application and detail of inventory is loaded in same view as table and rest of your screen so it will break if not used in non-exact mode.**

Imagine you have page registerd in router with system information and with list of active systems. And inside of this page you are loading inventory application:
```JSX
<Route exact path='/systems' component={ ActiveSystems }/>
```

Should be written as
```JSX
<Route path='/systems' component={ ActiveSystems }/>
```

## Usage of hot loading
To load such inventory via chrome just call `window.insights.loadInventory` with dependencies and wait for it to load
all data.

Expected dependencies is object with shape:
```JS
{
  react: React, //Whole react
  reactRouterDom: reactRouterDom //React router dom { withRouter, Switch, Route, Redirect, Link } are required
  reactIcons: reactIcons //PF icons { TimesIcon, SyncIcon, hieldAltIcon, DollarSignIcon, WrenchIcon, CertificateIcon } are required, but they might be changed and more will be needed in future
  reactCore: reactCore //PF react core items, best is to import * and pass whole reactCore
}
```
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';
import { registry } from '@red-hat-insights/insights-frontend-components';

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
    const { inventoryConnector, mergeWithEntities, mergeWithDetail } = await insights.loadInventory({
      react: React,
      reactRouterDom,
      reactCore,
      reactIcons
    });

    this.getRegistry().register({
      ...mergeWithEntities(),
      ...mergeWithDetail()
    });

    this.setState({
      InventoryCmp: inventoryConnector()
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

You'll have to also register inventory reducers so the data are fetched correctly that is represent by calling 
`this.getRegistry().register` with `mergeWithEntities` and `mergeWithDetail`.

## Usage variants
With inventory component loaded same as in previous step we have couple of variants of how to use this component

1) Just the detail - noice the Redirect with `entity/1` where `entity` is required and `1` is ID of desired entity
```JSX
import React from 'react';
import * as reactRouterDom from 'react-router-dom';
import * as reactCore from '@patternfly/react-core';
import * as reactIcons from '@patternfly/react-icons';

class SomeCmp extends React.Component {
  //...
  render() {
    const { InventoryCmp } = this.state;
    return (
      <InventoryCmp noTable />
      <reactRouterDom.Redirect to='/entity/1' />
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

class SomeCmp extends React.Component {
  //...
  async fetchInventory() {
    const { inventoryConnector, mergeWithEntities, mergeWithDetail} = await insights.loadInventory({
      react: React,
      reactRouterDom,
      reactCore,
      reactIcons
    });

    this.getRegistry().register({
      ...mergeWithEntities(),
      ...mergeWithDetail()
    });

    this.entitiesListener = addNewListener({
        actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITIES,
        callback: this.callSomeFunction
    });

    callSomeFunction({ data }) {
      //Do something with data Promise
    }

    this.setState({
      InventoryCmp: inventoryConnector()
    })
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

class SomeCmp extends React.Component {
  //...
  async fetchInventory() {
    const { inventoryConnector, mergeWithEntities, mergeWithDetail, INVENTORY_ACTION_TYPES } = await insights.loadInventory({
      react: React,
      reactRouterDom,
      reactCore,
      reactIcons
    });

    this.getRegistry().register({
      ...mergeWithEntities(),
      ...mergeWithDetail()
    });

    this.entityListener = addNewListener({
        actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITY,
        callback: this.callSomeOtherFunction
        }
    });

    callSomeOtherFunction({ data }) {
      //Do something with data Promise
    }

    this.setState({
      InventoryCmp: inventoryConnector()
    })
  }
  //...
}
```

### Changing list of entities
If you want to change list of entities you should change them in redux store so the changes are reflected in entity table automatically.

Function `mergeWithEntities` accepts redux reducer (function wwhich in simplest way can look like `(state) => state`), just to be clear reducer function accepts `state` and `payload` as parameter and return either unchanged state or state which is changed
based on payload.

You'll want to split the reducers from your app logic in our example we have all reducers stored under `src/store/reducers`, but your application can have them anywhere you want.

If you are going to change rows or entities in store, please use `mergeArraysByKey` function which helps you with merging both current state and new payload together so you don't loose any of it.
* `src/store/reducers.js` - let's use `applyReducerHash` to demonstrate how to use such function
```JS
import { applyReducerHash } from '@red-hat-insights/insights-frontend-components/Utilities/ReducerRegistry';
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
import { listReducer } from './store/reducers';

class SomeCmp extends React.Component {
  //...
  async fetchInventory() {
    const { inventoryConnector, mergeWithEntities, mergeWithDetail, INVENTORY_ACTION_TYPES } = await insights.loadInventory({
      react: React,
      reactRouterDom,
      reactCore,
      reactIcons
    });

    this.getRegistry().register({
      ...mergeWithEntities(listReducer),
      ...mergeWithDetail()
    });

    this.entityListener = addNewListener({
        actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITY,
        callback: this.props.fetchEntities
        }
    });

    this.setState({
      InventoryCmp: inventoryConnector()
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
import { entityDetailReducer } from './store/reducers';

class SomeCmp extends React.Component {
  //...
  async fetchInventory() {
    const {
      inventoryConnector,
      mergeWithEntities,
      mergeWithDetail,
      INVENTORY_ACTION_TYPES
    } = await insights.loadInventory({
      react: React,
      reactRouterDom,
      reactCore,
      reactIcons
    });

    this.getRegistry().register({
      ...mergeWithEntities(),
      ...mergeWithDetail(entityDetailReducer(INVENTORY_ACTION_TYPES))
    });

    this.entityListener = addNewListener({
        actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITY,
        callback: this.props.fetchEntities
        }
    });

    this.setState({
      InventoryCmp: inventoryConnector()
    })
  }
  //...
}
```
### Add custom app entity detail
If you want to display some information in entity detail you have option to do so, by adding details to store based on your application.

We'll use our reducers file and add some application to it
```JS
import { Overview } from '@red-hat-insights/insights-frontend-components';

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
