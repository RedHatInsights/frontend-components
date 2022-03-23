# Setup

To enable the shared quickstarts module and provided API, you must first configure your application to consume shared modules. There are differences for applications using the webpack config from `@redhat-cloud-services/frontend-components-config` and those who manage the configuration on their own.

## Setup using `@redhat-cloud-services/frontend-components-config` package

The setup is simple. Make sure you are using the latest stable version of the package. And install the quickstarts and frontend-components package.

```sh
npm update @redhat-cloud-services/frontend-components-config

npm i @patternfly/quickstarts @redhat-cloud-services/frontend-components
```

The module sharing is configured through the shared config.

## Setup using custom webpack config

### Install dependencies

```sh
npm i @patternfly/quickstarts @redhat-cloud-services/frontend-components
```

### Mark these libraries as singletons

In your federated modules plugin, mark these libraries as singletons. You most likely have some of them already marked:

```js
const { ModuleFederationPlugin } = require('webpack').container;

const moduleFederationPlugin = new ModuleFederationPlugin({
  // existing config
  ...
  shared: [
    // existing shared modules
    ...
    react: { singleton: true, eager: true },
    'react-dom': { singleton: true, eager: true },
    '@scalprum/react-core': { singleton: true, eager: true },
    '@patternfly/quickstarts': { singleton: true, eager: true },
  ]
})
```