# RedHat Cloud Services frontend components - inventory
[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-inventory.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-inventory)

This package is hot loaded via [insights-chrome](https://github.com/RedHatInsights/insights-chrome#readme) and exports new components for inventory table and detail. It also exports redux reducers and actions so usage is as simple as possible.

## Installation
You shouldn't install this package directly to your project, but if you really have to install it either with npm
```bash
npm i -S @redhat-cloud-services/frontend-components-inventory
```

or with yarn
```bash
yarn add @redhat-cloud-services/frontend-components-inventory
```

This package is dependent on [@redhat-cloud-services/frontend-components-utilities](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components-utilities), [@redhat-cloud-services/frontend-components](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components) and [@redhat-cloud-services/host-inventory-client](https://www.npmjs.com/package/@redhat-cloud-services/host-inventory-client) will automatically install them trough direct dependencies.

## Documentation Links

* Components
  * [inventory](doc/inventory.md)
  * [inventory](doc/inventory_header.md)
