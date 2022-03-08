import { Alert } from '@patternfly/react-core'

# Testing

Testing and module federation can be tricky. The modules do not exist in your local codebase. Some tests that include async modules can straight up fail. Follow this guide to set up your test environment to prevent test failures.

## Scalprum

The [console.redhat.com](console.redhat.com) is using a library called [scalprum](https://github.com/scalprum/scaffloding) we have developed to manage the asynchronous module loading. Some of the library API will be referenced in following examples.

## Mocking the \_\_scalprum\_\_ object

The \_\_scalprum\_\_ is an object on the browser window that holds modules metadata. It's used for module initialization and rendering.

In your jest global setup configuration add the following:

```js
// setupTests.js
global.__scalprum__ = {
    // rest of the mock
}
```

This is the main object we will use for the config

### Add application (async module) metadata

In order to load any module, the scalprum library requires module metadata. Even though there will be no API calls or other async actions, we still have to add the data otherwise, the module manager will not recognize the component.

**Make sure the object name matches the module scope**. For example, for Inventory modules it is `inventory`.

```diff
global.__scalprum__ = {
+ appsConfig: {
+   inventory: {
+     manifestLocation: 'https://console.stage.redhat.com/apps/inventory/fed-mods.json',
+     module: 'inventory#./RootApp',
+     name: 'inventory',
+   }    
+ }
}
```

None of the above, except the object name(in this case, `inventory`) has to match reality. None of it will be used, but it has to exist.

### Extends scalprum cache

The modules will be pulled from the cache. We have to make sure the cache will not expire during the test run. Set the cache timeout to something (un)reasonably long.

```diff
global.__scalprum__ = {
+ scalprumOptions: {
+  cacheTimeout: 999999,
+ },
  appsConfig: {
    inventory: {
      manifestLocation: 'https://console.stage.redhat.com/apps/inventory/fed-mods.json',
      module: 'inventory#./RootApp',
      name: 'inventory',
    }    
  }
}
```

### Adding module factory to the scalprum cache

In order to not make any synchronous calls, we will configure the library to think a valid module is in the factory cache. This is the stage when we actually mock the remote module. In this case, we will mock the InventoryTable component

```diff
global.__scalprum__ = {
+ scalprumOptions: {
+  cacheTimeout: 999999,
+ },
  appsConfig: {
    inventory: {
      manifestLocation: 'https://console.stage.redhat.com/apps/inventory/fed-mods.json',
      module: 'inventory#./RootApp',
      name: 'inventory',
    }    
- }
+ },
+ factories: {
+   inventory: {
+     expiration: new Date('01-01-3000'),
+     modules: {
+       './InventoryTable': {
+         __esModule: true,
+         default: () => (
+           <div>
+             <h1>Inventory mock</h1>
+           </div>
+         )
+       }
+     }
+   }
+ }
}
```

- `expiration` is the cache expiration date; it is set to year 3000. I think that might be enough
- `modules` is a set of remote modules you want to mock. In this case, we are mocking the `./InventoryTable` module

<Alert className="pf-u-m-lg" variant="info" title="Where can you find the module name?">The remote dependency scope and module name is the same as the "AsyncComponent" props. Check out the <a href="https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/src/Inventory/InventoryTable.js#L21" target="_blank">inventory example</a>.</Alert>

And that is it. If you run a test, the `InventoryTable` will render the mocked component. The same approach is used for any other AsyncComponent or remote module used in the platform.

You can use [this PR](https://github.com/RedHatInsights/compliance-frontend/pull/1570) as an example.
