# RedHat Cloud Services frontend components - webpack config

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config)

- [RedHat Cloud Services frontend components - webpack config](#redhat-cloud-services-frontend-components---webpack-config)
  - [Webpack 5](#webpack-5)
    - [Removed features with webpack 5](#removed-features-with-webpack-5)
  - [useProxy](#useproxy)
    - [Attributes](#attributes)
      - [localChrome](#localchrome)
      - [registry](#registry)
      - [Custom routes](#custom-routes)
        - [routes](#routes)
        - [routesPath](#routespath)
    - [Custom proxy settings](#custom-proxy-settings)
  - [standalone](#standalone)
    - [Usage](#usage)
      - [Simple](#simple)
      - [Advanced](#advanced)
        - [Using provided services](#Using-provided-services)
        - [Writing services](#Writing-services)
        - [Customizing default services](#Customizing-default-services)


## Webpack 5

In order to use the new version of webpack and its federated medules you'll have to change your run script to use new [`webpack serve`](https://webpack.js.org/configuration/dev-server/).
```JS
> webpack-dev-server -> webpack serve
```

You'll also have to update your `webpack-cli` dependency to `>=4.2.0`, this package has `peerDependency` on it so you should see warning in your console.

### Removed features with webpack 5

The new version of webpack 5 changed polyfills and plugin configs, some packages are outdated, one example is `lodash-webpack-plugin` this plugin is no longer maintain anyways. You should be just fine by installing `lodash` directly, imports can stay the same as before `import get from 'lodash/get'`.


## useProxy

Drop-in replacement for insights-proxy. Just add `useProxy: true` to your configuration.

```jsx
const { config: webpackConfig, plugins } = config({
  ...
  useProxy: true,
});
```

### Attributes

|Attribute|Type|Description|
|---------|----|-----------|
|[useProxy](#useproxy)|`boolean`|Enables webpack proxy.|
|[localChrome](#localChrome)|`string`|Path to your local chrome build folder.|
|[registry](#registry)|`(({ app, server, compiler, standaloneConfig }) => void)[]`|Express middleware to register.|
|[routes](#routes)|`object`|An object with additional routes.|
|[routesPath](#routespath)|`string`|A path to an object with additional routes.|
|[customProxy](#custom-proxy-settings)|`object[]`|An array of custom provided proxy configurations.|
|[env](#env)|`string`|Environment to proxy against such as ci-beta.|
|[useCloud](#use-cloud)|`boolean`|Toggle to use old fallback to cloud.redhat.com paths instead of console.redhat.com.|
|[target](#target)|`string`|Override `env` and `useCloud` to use a custom URI.|

#### localChrome

You can also easily run you application with a local build of Chrome by adding `localChrome: <absolute_path_to_chrome_build_folder>`.

```jsx
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  localChrome: process.env.INSIGHTS_CHROME,
});
```

```shell
INSIGHTS_CHROME=/Users/rvsiansk/insights-project/insights-chrome/build/
```

To check what the proxy is doing with your local chrome settings you can set `proxyVerbose: true`.

#### Registry

You can extend [express middleware](https://expressjs.com/en/guide/using-middleware.html) before Webpack or standalone does by passing an array of callbacks. This can be useful to override specific test files independent of `standalone` config.

```js
const express = require('express');

  registry: [
    // App is the express app object.
    // Server is the webpack-dev-server object with config. This will break with webpack-dev-server@v4, so tread lightly
    // Compiler is the webpack compiler object. You probably don't need it...
    // StandaloneConfig is the parsed standalone config given

    // Example: override main.yml
    ({ app, server, compiler, standaloneConfig }) => app.get('(/beta)?/config/main.yml', (_req, res) => res.send('heyo'))

    // Example: override entire cloudServicesConfig
    ({ app, server, compiler, standaloneConfig }) => {
      const staticConfig = express.static('pathToLocalCloudServicesConfig');
      app.use('(/beta)?/config', staticConfig);
    }
  ]
```

#### Custom routes

If you want to serve files or api from different URL you can either pass `routes` to config or `routesPath` for file which exports these routes.

##### routes

```JS
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  routes: {
      '/config/main.yml': { host: 'http://127.0.0.1:8889' }
  },
```

##### routesPath

```JS
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  routesPath: process.env.CONFIG_PATH
```

```shell
CONFIG_PATH=/home/khala/Documents/git/RedHatInsights/spandx.config.js
```

```JS
// /home/khala/Documents/git/RedHatInsights/spandx.config.js
module.exports = {
  routes: {
    '/api': { host: 'PORTAL_BACKEND_MARKER' },
    '/config': { host: 'http://127.0.0.1:8889' },
    '/beta/config': { host: 'http://127.0.0.1:8889' },
  }
};
```

#### Custom proxy settings

You can add an array of additional [custom proxy configuration.](https://webpack.js.org/configuration/dev-server/#devserverproxy).

*Example*:

```jsx
const { config: webpackConfig, plugins } = config({
  ...
  customProxy: [
    {
      context: ['/api'],
      target: 'https://qa.cloud.redhat.com',
      secure: false,
      changeOrigin: true
    },
  ],
});
```

This configuration will redirect all API requests to QA environment, so you can check CI UI with QA data.

#### Env
A hyphenated string in the form of (qa|ci|stage|prod)-(stable|beta). Used to determine the proxy target (such as ci.console.redhat.com or console.stage.redhat.com) and branch to checkout of build repos. If "stage" is specific qa is used as the branch.

#### Use cloud

If you want to run in legacy mode pass `useCloud: true` in your config, this way paths which does not match your proxy config (API for instance) will be passed to `cloud.redhat.com` (respective to your env `ci|qa|stage`). Without this all fallback routes will be redirected to `console.redhat.com`.

#### Target
Override for the target `env` and `useCloud` build. Useful for cross-environment testing.

## standalone
A way to run cloud.redhat.com apps from `localhost` offline.

### Usage
#### Simple
Just pass `true` to use the 4 default services:
- Insights-chrome cloned locally
  - Keycloak on localhost:4001 for user auth
  - Users admin/admin and user/user
- Entitlements-config cloned locally
  - All entitlements granted
- Landing page cloned locally
- Cloud services config cloned locally

```js
const { config: webpackConfig, plugins } = config({
  ...
  env: 'ci-beta', // Env to use when cloning repos
  reposDir: 'repos', // Directory to clone repos into
  standalone: true
});
```

#### Advanced
You can use provided services, write your own, or customize the default services.

##### Using provided services
Check config-utils/standalone/services to see what's supported.

```js
const {
  rbac,
  backofficeProxy,
  defaultServices,
} = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

const { config: webpackConfig, plugins } = config({
  standalone: {
    rbac,
    backofficeProxy,
    ...defaultServices,
  },
});
```

##### Writing services
Services have the following schema:
```js
{
    // List of assets and their names to clone
    assets: {
        // Can be a local path or git url with optional postpended branch name
        // Once cloned will be replaced with absolute path to repo
        [key]: 'https://github.com/redhatinsights/entitlements-config#qa'
    },
    // List of services to run with docker
    services: {
        keycloak: {
            // Passed to docker
            args: string[],
            // If other services need to wait for this one to start
            // look for this message in the logs
            startMessage: string,
            // List of services to wait for before starting.
            // Formatted like `projectName_serviceName` (i.e. rbac_redis)
            dependsOn: string[],
        },
    },
    // Can be a local path or git url with optional postpended branch name
    // Once cloned will be replaced with absolute path to repo
    path: 'https://github.com/redhatinsights/insights-chrome-build#qa-beta',
    // Function to modify express.js [app](https://expressjs.com/en/4x/api.html)
    // runs [before](https://webpack.js.org/configuration/dev-server/#devserverbefore) webpack-dev-server
    // Great for adding routes
    register({ app, server, compiler, config }) {},
    // Props passed onto webpackDevServer.proxy
    context: ['/auth'],
    target: 'http://localhost:4001'
}
```

In case you need access to some other config it can also be a function:
```js
({ env, port }) => { ... }
```
and your services can access `assets` as well:
```js
services: ({ env, port, assets }) => { ... }
```

For example, to serve `main.yml` from the `prod-stable` branch in Github:
```js
const express = require('express');

config(
  standalone: {
    servicesConfig: {
        path: 'https://github.com/redhatinsights/cloud-services-config#prod-stable',
        register({ app, config }) {
            const staticConfig = express.static(config.servicesConfig.path);
            app.use('(/beta)?/config', staticConfig);
        }
    }
  }
)
```

##### Customizing default services
The chrome, config, entitlements, and landing services are exposed for you to mutate:
```js
const { defaultServices } = require('@redhat-cloud-services/frontend-components-config-utilities/standalone');

defaultServices.chrome.path = '/path/to/my/insights-chrome';
const { config: webpackConfig, plugins } = config({
  standalone: defaultServices
});
```
