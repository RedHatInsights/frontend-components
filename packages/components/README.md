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

## Treeshaking

In order not to increase your bundle size you you should either import components trough direct imports or use babel plugin to change relative imports to direct imports. You can mix both direct imports and babel plugin, it's just convenient to use the babel plugin so you don't have to change all of your imports.


### Direct imports

You can try `esm` or `cjs` whichever fits you more, generally `ems` modules should yield less code, but is considered bleading edge and could break your build, cjs (refers to commonjs) will work out of the box (it adds about 1 or 2 KB of code to each build). For instance `tableToolbar` can be imported as:
```JSX
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/esm/TableToolbar';
```

or

```JSX
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/TableToolbar';
```

If it breaks your build for some reason, you can always fallback to default `umd` files, but this will most probably bloat your build and should be used as last resort.

```JSX
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/TableToolbar';
```

### Babel plugins

There are 2 plugins that can be used to change relative imports to direct imports
* [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) - easy setup, however not that extensible
* [transform-imports](https://www.npmjs.com/package/transform-imports) - harder to setup, but allows custom rules

Since our components require a bit more setting up, we are recommending using `transform-imports`.

Change your babel config to be javascript config `babel.config.js` so you can use JS functions to properly transform your imports

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
                  `@redhat-cloud-services/frontend-components/components/esm/${FECMapper[importName] || importName}`,
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

As with direct imports you can choose from `esm` and `cjs`, as a fallback you can use this tranform function (but this should only be used if for some reason `esm` or `cjs` is not working properly in your project)

```JS
transform: (importName) =>`@redhat-cloud-services/frontend-components/components/${FECMapper[importName] || importName}`,

```

#### Jest error

If you see Jest errors after applying transform-imports plugin you should add to your Jest config

```JSON
"transformIgnorePatterns": [ "/node_modules/(?!@redhat-cloud-services)" ],
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
  * [wizard](doc/wizard.md)
  * [pagination](doc/pagination.md)
  * [treeview-table](doc/treeview-table.md)
  * [section](doc/section.md)
  * [dark](doc/dark.md)
  * [breadcrumbs](doc/breadcrumbs.md)
  * [reboot](doc/reboot.md)
