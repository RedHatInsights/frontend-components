[![Build Status](https://travis-ci.org/RedHatInsights/frontend-components.svg?branch=master)](https://travis-ci.org/RedHatInsights/frontend-components)
[![codecov](https://codecov.io/gh/RedHatInsights/frontend-components/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/frontend-components)

# frontend-components

Monorepo of Red Hat Cloud services Components for applications in a React.js environment.

## Packages
* [utils](https://github.com/RedHatInsights/frontend-components/tree/master/packages/utils#readme) - library that has utilities functions
* [charts](https://github.com/RedHatInsights/frontend-components/tree/master/packages/charts#readme) - small group of general charts
* [components](https://github.com/RedHatInsights/frontend-components/tree/master/packages/components#readme) - series of common components
* [notifications](https://github.com/RedHatInsights/frontend-components/tree/master/packages/notifications#readme) - common component to display toast notifications
* [remediations](https://github.com/RedHatInsights/frontend-components/tree/master/packages/remediations#readme) - hot loaded component that shows remediations buton and wizard
* [inventory](https://github.com/RedHatInsights/insights-inventory-frontend) - Inventory packages moved to Inventory UI repository
* [sources](https://github.com/RedHatInsights/sources-ui/) - Sources Wizard component was moved to Sources UI repository (it's also stored here in `sources_backup` branch)
* [testing](https://github.com/RedHatInsights/frontend-components/tree/master/packages/testing) - Testing utilities.
* [advisor-components](https://github.com/RedHatInsights/frontend-components/tree/master/packages/advisor-components#readme) - a library of Advisor components (rule content, report details, charts, etc.).
## Contributing to documentation

To contribute to docs and run the docs developemnt environment, please follow these [guides](https://github.com/RedHatInsights/frontend-components/tree/master/packages/docs/pages/contributing).

## Treeshaking PF with babel plugin

Patternfly packages require some enhancements to be done in order to properly treeshake your bundles. You can either use direct imports or plugin that does that for you, there are actually 2 plugins to do this
* [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) - easy setup, however not that extensible
* [babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports) - harder to setup, but allows custom rules

Since Patternfly requires a bit of custom settings you should use `babel-plugin-transform-imports`. Change your babel to be JS file `babel.config.js` and add these changes to it

```JS
// This is required because of how PF is using their css modules.
// This `extensions` will be removed in future, we'll have to come up with some other clever way of doing this
require.extensions['.css'] = () => undefined;
const path = require('path');
const glob = require('glob');

// list of custom named exports, this is just a few, and you should probably update it to fit your project
const mapper = {
  TextVariants: 'Text',
  DropdownPosition: 'dropdownConstants',
  EmptyStateVariant: 'EmptyState',
  TextListItemVariants: 'TextListItem',
  TextListVariants: 'TextList'
};

module.exports = {
    presets: [
        // list of your presets goes here
    ],
    plugins: [
        // your other plugins
        [
            'transform-imports',
            {
              '@patternfly/react-core': {
                transform: (importName) => {
                  const files = glob.sync(
                    path.resolve(
                      __dirname,
                      // you can use `js` or `esm`
                      `./node_modules/@patternfly/react-core/dist/js/**/${mapper[
                      importName
                      ] || importName}.js`
                    )
                  );
                  if (files.length > 0) {
                    return files[0].replace(/.*(?=@patternfly)/, '');
                  } else {
                    throw `File with importName ${importName} does not exist`;
                  }
                },
                preventFullImport: false,
                skipDefaultConversion: true
              }
            },
            'react-core'
          ],
          [
            'transform-imports',
            {
              '@patternfly/react-icons': {
                transform: (importName) =>
                  // you can use `js` or `esm`
                  `@patternfly/react-icons/dist/js/icons/${importName
                  .split(/(?=[A-Z])/)
                  .join('-')
                  .toLowerCase()}`,
                preventFullImport: true
              }
            },
            'react-icons'

    ]
}

```

#### Jest error

If you see Jest errors after applying transform-imports plugin you should add to your Jest config

```JSON
"transformIgnorePatterns": [ "/node_modules/(?!@redhat-cloud-services)" ],
```

## Local tasks
Since this is monorepo repository it has some special requirements how to run tasks. This repository is using [lerna](https://github.com/lerna/lerna), so if you have newer version of npm you can run `npx lerna $TASK` where $TASK is one of [lerna commands](https://github.com/lerna/lerna/tree/master/commands).

These tasks are preconfigured
* `npm start` - will perform start in all packages, you can change the scope by calling `npm start -- --scope=pckg_name` to run start in `pckg_name`
* `npm run build` - will perform build in all packages, you can change the scope by calling `npm start -- --scope=pckg_name` to run start in `pckg_name`
* `npm run clean` - to remove all node modules in root and in packages folder
* `npm run bootstrap` - to install packages correctly (will link local dependencies as well)
* `npm run test` - to run tests locally
* `npm run watch` - similiar to start, but will emit files to disk (good for local links)
* `npm run playground` - to launch local demo on port 8080

## Running locally

There are two ways to test changes from packages in this repository in other applications: Using `npm link` or `yalc`.

### Using `npm link`

1. Run `npm install` in the root of the `frontend-components` working copy
2. Change into the directory of the package you are working on, for example `cd packages/components` and run `npm link`*
3. Change into the directory of the application you'd like to include the package and run `npm link @redhat-cloud-services/frontend-components`*

After these steps the package you want to test should be linked and the last `npm link` command should have returned the paths it linked the package from.

When linked successfully you can build the package(s) by running either  `npm start -- --scope=@redhat-cloud-services/frontend-components` or `npm run build -- --scope=@redhat-cloud-services/frontend-components` in the `frontend-components` working copy.

Both will build the `@redhat-cloud-services/frontend-components` package, to build all packages run these commands without `-- --scope=@redhat-cloud-services/frontend-components`.*

Once the packages are built the application the package is linked in should also be able to build and include any changes made locally in the `frontend-components` packages.

_* Depending on what package you are working on this arguments need to change accordingly._

### Using `yalc`

yalc acts as very simple local repository for your locally developed packages that you want to share across your local environment.

1. Install [yalc](https://github.com/whitecolor/yalc) globally. e.g. `npm install -g yalc`.
2. Run `npm install` in the root of the `frontend-components` working copy.
3. Change into the directory of the package you are working on, for example `cd packages/components` and run `yalc publish`*
4. Change into the directory of the application you'd like to include the package and run `yalc add @redhat-cloud-services/frontend-components`*

After these steps the package you want to test should be linked and the `yalc add` command should have returned the paths it linked the package from.

When added successfully you can build the package(s) by running `npm run build -- --scope=@redhat-cloud-services/frontend-components` in the `frontend-components` working copy and pushing by going into the directory of the package and running `yalc push`.

`yalc` does not watch the files, but if you would like to do this automatically you can build the package(s) by running: `npm start -- --scope=@redhat-cloud-services/frontend-components` and having a separate terminal that does the local publishing of the packages by running: `watch -n 0.5 yalc publish --push --changed`. This will publish the package only when there are changes.

To build all packages run these commands without `-- --scope=@redhat-cloud-services/frontend-components`.*

Once the packages are built the application the package is linked in should also be able to build and include any changes made locally in the `frontend-components` packages.

To remove the package info from package.json and yalc.lock, run `yalc remove @redhat-cloud-services/frontend-components` to remove a single package; or `yalc remove --all` to remove all packages from a project.

_* Depending on what package you are working on this arguments need to change accordingly._

## Creating new package
If none package suits scope of new changes, we need to create new package by creating folder inside `packages` and running `npm init` in it.

## Run release

Webhooks are enabled to trigger releases on travis from comment on merged PR. If you are member of group responsible for releases you can add new commnent to merged PR `Release minor`, `Release bugfix` or `Release` in order to trigger new release.

You can also draft a release by adding label `release` or `release minor` and once this PR is merged new release will be triggered.

## Typescript guidelines

Typescript build has been finally introduced to the repository. All modules will be eventually refactored into typescript. When refactoring, or creating new modules, please follow these instructions when creating types:

### React components

1. All component props must be an interface and must be exported. This is required for consuming apps to use features like `omit` or `extends` when developing with typescript. A nice example is generating JSX from array structure, but for some reason, extension/exclustion of the interface is required.

```TS

import React from 'react';
import { AlertProps, AlertVariant } from '@patternfly/react-core';

/**
 * Custom component wrapper from FEC
 * It has a description prop which is mapped to the PF Alert children prop
 * */
interface AlertWrapper extends AlertProps {
  description?: string
}

/**
 * Local type which builds on FEC defined type
*/
interface LocalAlertType extends AlertWrapper {
  id: string
}

const CustomComponent: React.ComponentType = ({ data }) => {
    const alertsStructure: LocalAlertType[] = data.map(({ uuid, status, title, message }) => ({
        id: uuid,
        variant: status === 500 ? AlertVariant.danger : AlertVariant.info,
        title,
        description: message
    }));

    return alertsStructure.map(({ id, ...props }) => <AlertWrapper key={id} {...props} />);
};

```

2. When creating a wrapper around PF components, always extend original components props. This will ensure that all original props are accepted by your component wrapper. If you have to exclude some original prop, use `Omit` generic. Exclusion might be required because the wrapper is setting a prop by default.

```TS
import React from 'react';
import { Alert, AlertProps, AlertVariant } from '@patternfly/react-core';

export interface AlertWrapperProps extends Omit<AlertProps, 'variant'> {
  specificRequiredProp: React.ReactNode
}

const AlertWrapper: React.FunctionComponent<AlertWrapperProps> = ({ specificRequiredProp, ...props }) => (
    <div>
        <span>{specificRequiredProp}</span>
        <Alert {...props} variant={AlertVariant.danger} />
    </div>
);

export default AlertWrapper;


```

3. Always export nested types. It can be required by a consumer app when constructing component props.

```TS
import React from 'react';
import { Alert, AlertProps, AlertVariant } from '@patternfly/react-core';

export type CustomType = 'A' | 'B' | 2 | 'something'
export interface CustomInterface {
  a: string,
  b?: number
}

export interface AlertWrapperProps extends Omit<AlertProps, 'variant'> {
  nestedNonPrimitiveType: CustomType
  nestedNonPrimitiveInterface: CustomInterface
  nestedNonPrimitiveArray: CustomType[]
}

const AlertWrapper: React.FunctionComponent<AlertWrapperProps> = ({ specificRequiredProp, ...props }) => (
    <div>
        <span>{specificRequiredProp}</span>
        <Alert {...props} variant={AlertVariant.danger} />
    </div>
);

export default AlertWrapper;

```

### General guidelines

#### Names

1. Use PascalCase for type names.
2. Do not use I as a prefix for interface names.
3. Use PascalCase for enum values.
4. Use camelCase for function names.
5. Use camelCase for property names and local variables.
6. Do not use _ as a prefix for private properties.
7. Use whole words in names when possible.

#### Comments

1. Always add a short description to exported types. The description is used for generating documentation
2. Use JSDoc style comments for functions, interfaces, enums, and classes.

```TS
export interface AlertWrapperProps extends Omit<AlertProps, 'variant'> {
  /**
   * Alert id
  */
  id: string,
  /**
   * A content displayed as Patternfly Alert children
  */
  description: React.ReactNode
}

```

#### Types

1. Do not export types/functions unless you need to share it across multiple components.
2. Do not introduce new types/values to the global namespace.
3. Shared types should be defined in types.ts.
4. Within a file, type definitions should come first.

#### null and undefined

1. Use undefined. Do not use null.

#### General Constructs

For a variety of reasons, we avoid certain constructs, and use some of our own. Among them:

1. Do not use for..in statements; instead, use ts.forEach, ts.forEachKey and ts.forEachValue. Be aware of their slightly different semantics.
2. Try to use ts.forEach, ts.map, and ts.filter instead of loops when it is not strongly inconvenient.

#### Style

1. Use arrow functions over anonymous function expressions.
2. Open curly braces always go on the same line as whatever necessitates them.
3. Parenthesized constructs should have no surrounding whitespace.
4. A single space follows commas, colons, and semicolons in those constructs. For example:
```ts
for (var i = 0, n = str.length; i < 10; i++) { }
if (x < 10) { }
function f(x: number, y: string): void { }
```
5. Use a single declaration per variable statement
```ts
(i.e. use var x = 1; var y = 2; over var x = 1, y = 2;).
```

### Typescript Refactoring

1. Pick a TO DO card from: https://github.com/RedHatInsights/frontend-components/projects/1 and move it to in-progress column. Only modules from the components package should be migrated at the moment.
2. Make sure that all local module dependencies and already migrated to TS. If some of the local dependencies have not been migrated, migrate them first and move the related cards to the in-progress column
```
import A from './a' // <- not migrated to TS, has to be migrated first
```
3. Make sure that the `index` file in the appropriate folder is migrated to TS. If not, do it.
```diff
- index.js
+ index.ts
```
4. Follow typescript guidelines when refactoring
5. Create PR and link it to the project card

