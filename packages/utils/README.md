# RedHat Cloud Services frontend components - utils

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-utilities.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-utilities)

This package exports common functions to be used in other packages.

## Installation
With NPM
```bash
npm i -S @redhat-cloud-services/frontend-components-utilities
```

With yarn
```bash
yarn add @redhat-cloud-services/frontend-components-utilities
```

This package is dependent on [@redhat-cloud-services/frontend-components](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components) it will automatically installed trough direct dependencies.

## Migration guide
### v2 -> v3

### Import path change

Assets are no longer under `/files` directory but directly at the root of the build directory.

```jsx
// v2
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';

// v3
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
```

#### No UMD build

Utils package no longer provides UMD version of the build.

#### RowLoader

RowLoader component is no longer a part of `helpers` file but is now a stand-alone component. Import path has changed.

```jsx
// v2
import { RowLoader } from '@redhat-cloud-services/frontend-components-utilities/helpers'
// v3
import RowLoader from '@redhat-cloud-services/frontend-components-utilities/RowLoader'
```

#### SCSS files

SCSS files are now under `styles` directory.

```scss
/** v2 */
@import '~@redhat-cloud-services/frontend-components-utilities/styles/all';
/** v3 */
@import '~@redhat-cloud-services/frontend-components-utilities/styles/all''

```

#### inventoryDependencies

This module is now deprecated. Use a new Inventory component compatible with chrome 2.0.

#### parseCvssScore

Function `parseCvssScore` has been moved to a stand-alone file. Import path has changed.
```jsx
// v2
import { parseCvssScore } from '@redhat-cloud-services/frontend-components-utilities/helpers'
// v3
import parseCvssScore from '@redhat-cloud-services/frontend-components-utilities/parseCvssScore'
```

## Documentation Links

* Utils
  * [redux](doc/redux.md)
  * [routerParams](doc/routerParams.md)
  * [debounce](doc/debounce.md)
  * [cypress](doc/Cypress.md)

Additionaly it exports these utilities
* AsyncComponent - class to load component via async calls
* helpers - custom helper functions
* MiddlewareListener - redux listener on actions, they can fire additional action or be cancelled
* Registry - reducer registry
* RouterParams - maps route to props
* interceptors - to be used with axios clients
* Styles - custom style functions in sass
