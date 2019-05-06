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
Install all packages by calling `npm install` in root folder. This will perform bootstrap and initial build as well. After that you can choose either playground for testing things seperately, or `npm run build` to build all packages.

## Creating new package
If none package suits scope of new changes, we need to create new package by creating folder inside `packages` and running `npm init` in it.

## Commit format

[Semantic release](https://github.com/semantic-release/semantic-release) is used in this project, so to trigger new release you should add specific format into your commit messages and new release will be triggered when PR is merged.

### Used formatter

[Commit analyzer wildcard](https://github.com/karelhala/commit-analyzer-wildcard) is used for parsing commit messages so to trigger new release add one of these strings into your commit and new release is triggered

* Major - `<x.x.x>` or `<x.x.?>` or `<x.?.x>` or `<x.?.?>`
* Minor - `<?.x.x>` or `<?.x.?>`
* Bug - `<?.?.x>`
* No release - `<no>`
