# RedHat Cloud Services frontend components - components
[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components)

This package consists of shared components required by RedHat Cloud Services team.

## Installation
With npm 
```bash
npm i -S @redhat-cloud-services/frontend-components
```

With yarn
```bash
yarn add @redhat-cloud-services/frontend-components
```

This package is dependent on [@redhat-cloud-services/frontend-components-utilities](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-utilities) and will automatically install it trough direct dependencies.

## Migration v2 -> v3

### Direct imports path changes

- Remove `cjs` or `esm` from your import paths.
- Remove the `components` fragment from your import path
- Modules now have default value

```jsx
// v2
import { Ansible } from '@redhat-cloud-services/frontend-components/components/cjs/Ansible';

// v3
import Ansible from '@redhat-cloud-services/frontend-components/Ansible';
/** OR */
import { Ansible } from '@redhat-cloud-services/frontend-components/Ansible';
```

### Importing styles is no longer required

Importing CSS for components is no longer required. Components import their styling whenever they are rendered for the first time.

```diff
-@import '~@redhat-cloud-services/frontend-components/index.css';
```

### Sub components imports.

When importing a partial component like `TextFilter` from `ConditionalFilter`, use direct import shorthand from `ConditionalFilter`. Do not import from `TextFilter` file directly!
All imports must have at most only one level!

```jsx
// OK
import { X } from '@redhat-cloud-services/frontend-components/<ModuleName>'
// Wrong!!
import X from '@redhat-cloud-services/frontend-components/<ModuleName>/X'

```
Deeper imports will break automatic csj/esm module resolution.


## Treeshaking

In order not to improve your bundle size you you should either import components trough direct imports or use babel plugin to change relative imports to direct imports. You can mix both direct imports and babel plugin, it's just convenient to use the babel plugin so you don't have to change all of your imports.


### Direct imports

For speedy build times, you can use direct import paths For instance `tableToolbar` can be imported as:
```JSX
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';
```

You can also use shorthand imports.

### Babel plugins

There are 2 plugins that can be used to change relative imports to direct imports
* [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) - easy setup, however not that extensible
* [babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports) - harder to setup, but allows custom rules

Since our components require a bit more setting up, we are recommending using `babel-plugin-transform-imports`.

Change your babel config to be javascript config `babel.config.js` so you can use JS functions to properly transform your imports.
Not every component has its own directory. You can use mapper to map component name to directory.

```JS
const FECMapper = {
    SkeletonSize: 'Skeleton',
    PageHeaderTitle: 'PageHeader'
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
              '@redhat-cloud-services/frontend-components': {
                transform: (importName) =>
                  `@redhat-cloud-services/frontend-components/${FECMapper[importName] || importName}`,
                preventFullImport: false,
                skipDefaultConversion: true
              }
            },
            'frontend-components'
        ]
        // other plugins, for instance PF transform imports and such as well
    ]
};
```

As with direct imports you can choose between `esm` and `cjs` output.

```JS
// cjs
transform: (importName) =>`@redhat-cloud-services/frontend-components/${FECMapper[importName] || importName}`,
// esm
transform: (importName) =>`@redhat-cloud-services/frontend-components/esm/${FECMapper[importName] || importName}`,

```

## Documentation Links

* Components
  * [sample](doc/sample.md)
  * [page_header](doc/page_header.md)
  * [tabLayout](doc/tabLayout.md)
  * [emptyTable](doc/emptyTable.md)
  * [input](doc/input.md)
  * [dropdown](doc/dropdown.md)
  * [longTextTooltip](doc/longTextTooltip.md)
  * [spinner](doc/spinner.md)
  * [ansible](doc/ansible.md)
  * [filters](doc/filters.md)
  * [battery](doc/battery.md)
  * [shield](doc/shield.md)
  * [table](doc/table.md)
  * [truncate](doc/truncate.md)
  * [tableToolbar](doc/tableToolbar.md)
  * [pagination](doc/pagination.md)
  * [treeview-table](doc/treeview-table.md)
  * [section](doc/section.md)
  * [breadcrumbs](doc/breadcrumbs.md)
  * [reboot](doc/reboot.md)
  * [useScreenSize](doc/useScreenSize.md)
