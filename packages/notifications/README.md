# RedHat Cloud Services frontend components - notifications

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-notifications.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-notifications)

This package has portal component that shows toast notifications based on [PF4 alert component](https://v2.patternfly.org/documentation/core/components/alert).


## Installation
With NPM
```bash
npm i -S @redhat-cloud-services/frontend-components-notifications
```

With yarn
```bash
yarn add @redhat-cloud-services/frontend-components-notifications
```

This package is dependent on [@redhat-cloud-services/frontend-components-utilities](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-utilities) it will automatically install it trough direct dependencies.

## Treeshaking

In order not to decrease your bundle size you you should either import components trough direct imports or use babel plugin to change relative imports to direct imports. You can mix both direct imports and babel plugin, it's just convenient to use the babel plugin so you don't have to change all of your imports.

### Direct imports

It's recommended to use absolute import paths for improved build times. Import will be automatically resolved to ESM or CJS version of the build based on the environment.
```JSX
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
```
### Migration V2 -> V3
V3 of the packages has introduced improved build output for absolute import paths, It's no longer required to point towards ESM/CJS asset. This is now resolved at build time by the asset.

**Remove ESM/CJS references**

```jsx
// v2
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/esm/NotificationsPortal';
// v3
import NotificationPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
```

**Notification reducer, actions and action types have changed import path**

The correct import path is now at: `@redhat-cloud-services/frontend-components-notifications/redux`

For example: 
```jsx
// v2
import { addNotification, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
// v3
import { notificationsReducer, addNotification, ADD_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/redux';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
```

**Adjust babel transform import config**

If you are using babel transform imports plugin, you need to change the import path.
```jsx
// v2
{
  transform: (importName) => `@redhat-cloud-services/frontend-components-notifications/esm/${importName}`
}
// v3
{
  transform: (importName) => `@redhat-cloud-services/frontend-components-notifications/${importName}`
}

```

### Babel plugins

There are 2 plugins that can be used to change relative imports to direct imports
* [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) - easy setup, however not that extensible
* [babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports) - harder to setup, but allows custom rules

Since our components require a bit more setting up, we are recommending using `babel-plugin-transform-imports`.

Change your babel config to be javascript config `babel.config.js` so you can use JS functions to properly transform your imports

```JS
notificationsMapper = {
    addNotification: 'redux',
    removeNotification: 'redux',
};
module.exports = {
    presets: [
        // your presets go here
    ],
    plugins: [
        // your plugins
        [
            'transform-imports',
            {
              '@redhat-cloud-services/frontend-components-notifications': {
                transform: (importName) =>
                  `@redhat-cloud-services/frontend-components-notifications/${notificationsMapper[importName] || importName}`,
                preventFullImport: true,
              }
            },
            'frontend-notifications'
        ]
        // other plugins, for instance PF transform imports and such as well
    ]
};
```

### List of bundles
* `index` - the entire notifications bundle, should be used as fallback if something does not exists in other modules
* `notificationsMiddleware` - middleware function to hook into your redux
* `actions` - list of notifications actions
* `actionTypes` - list of redux action types
* `NotificationPortal` - portal to render your notifications to
* `notifications` - redux reducers are exported in this file

## Documentation Links

* Usage
  * [Notifications](doc/notifications.md)
