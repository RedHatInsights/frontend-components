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
* [inventory](https://github.com/RedHatInsights/frontend-components/tree/master/packages/inventory#readme) - hot loaded inventory component (table and detail)
  * [inventory-general-info](https://github.com/RedHatInsights/frontend-components/tree/master/packages/inventory-general-info#readme) - directly imported component with redux store  to show system information
  * [inventory-vulnerabilities](https://github.com/RedHatInsights/frontend-components/tree/master/packages/inventory-vulnerabilities#readme) - directly imported component with redux store to show vulnerability data
  * [inventory-compliance](https://github.com/RedHatInsights/frontend-components/tree/master/packages/inventory-compliance#readme) - directly imported component with graphql to show compliance data
  * [inventory-insights](https://github.com/RedHatInsights/frontend-components/tree/master/packages/inventory-insights#readme) - directly imported component to show insights data

## Treeshaking PF with babel plugin

Patternfly packages require some ehancements to be done in order to properly treeshake your bundles. You can either use direct imports or plugin that does that for you, there are actually 2 plugins to do this
* [babel-plugin-import](https://www.npmjs.com/package/babel-plugin-import) - easy setup, however not that extensible
* [babel-plugin-transform-imports](https://www.npmjs.com/package/babel-plugin-transform-imports) - harder to setup, but allows custom rules

Since Patternfly requires a bit of custom settings you should use `transform-imports`. Change your babel to be JS file `babel.config.js` and add these changes to it

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

To test changes from packages in this repository in other applications follow these steps:

1. Run `npm install` in the root of the `frontend-components` working copy
2. Change into the directory of the package you are working on, for example `cd packages/components` and run `npm link`*
3. Change into the directory of the application you'd like to include the package and run `npm link @redhat-cloud-services/frontend-components`*

After these steps the package you want to test should be linked and the last `npm link` command should have returned the paths it linked the package from.

When linked successfully you can build the package(s) by running either  `npm start -- --scope=@redhat-cloud-services/frontend-components` or `npm run build -- --scope=@redhat-cloud-services/frontend-components` in the `frontend-components` working copy.

Both will build the `@redhat-cloud-services/frontend-components` package, to build all packages run these commands without `-- --scope=@redhat-cloud-services/frontend-components`.*

Once the packages are built the application the package is linked in should also be able to build and include any changes made locally in the `frontend-components` packages.

_* Depending on what package you are working on this arguments need to change accordingly._

## Creating new package
If none package suits scope of new changes, we need to create new package by creating folder inside `packages` and running `npm init` in it.

## Run release

Webhooks are enabled to trigger releases on travis from comment on merged PR. If you are member of group responsible for releases you can add new commnent to merged PR `Release minor`, `Release bugfix` or `Release` in order to trigger new release.

You can also draft a release by adding label `release` or `release minor` and once this PR is merged new release will be triggered.
