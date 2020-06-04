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

In order not to increase your bundle size you you should either import components trough direct imports or use babel plugin to change relative imports to direct imports. You can mix both direct imports and babel plugin, it's just convenient to use the babel plugin so you don't have to change all of your imports.

### Direct imports

You can try `esm` or `cjs` whichever fits you more, generally `ems` modules should yield less code, but is considered bleading edge and could break your build, cjs (refers to commonjs) will work out of the box (it adds about 1 or 2 KB of code to each build). For instance `addNotification` can be imported as:
```JSX
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/esm/actions';
```

or

```JSX
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/cjs/actions';
```

If it breaks your build for some reason, you can always fallback to default `umd` index file, but this will most probably bloat your build and should be used as last resort.

```JSX
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
```

### Babel plugins

There are 2 plugins that can be used to change relative imports to direct imports
* [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) - easy setup, however not that extensible
* [transform-imports](https://www.npmjs.com/package/transform-imports) - harder to setup, but allows custom rules

Since our components require a bit more setting up, we are recommending using `transform-imports`.

Change your babel config to be javascript config `babel.config.js` so you can use JS functions to properly transform your imports

```JS
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
                  `@redhat-cloud-services/frontend-components-notifications/cjs/${importName}`,
                preventFullImport: true
              }
            },
            'frontend-notifications'
        ]
        // other plugins, for instance PF transform imports and such as well
    ]
};
```

As with direct imports you can choose from `esm` and `cjs`.

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
