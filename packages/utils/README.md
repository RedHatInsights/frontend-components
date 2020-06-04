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


## Documentation Links

* Utils
  * [redux](doc/redux.md)
  * [routerParams](doc/routerParams.md)

Additionaly it exports these utilities
* AsyncComponent - class to load component via async calls
* helpers - custom helper functions
* MiddlewareListener - redux listener on actions, they can fire additional action or be cancelled
* Registry - reducer registry
* Deffered - deffered helper function
* RouterParams - maps route to props
* interceptors - to be used with axios clients
* Styles - custom style functions in sass
