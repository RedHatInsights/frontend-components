# RedHat Cloud Services frontend components - webpack config

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config)

- [RedHat Cloud Services frontend components - webpack config](#redhat-cloud-services-frontend-components---webpack-config)
  - [Webpack 5](#webpack-5)
    - [Removed features with webpack 5](#removed-features-with-webpack-5)
  - [useProxy](#useproxy)
    - [Attributes](#attributes)
      - [useChromeTemplate](#usechrometemplate)
      - [localChrome](#localchrome)
      - [keycloakUri](#keycloakuri)
      - [Registry](#registry)
      - [Custom routes](#custom-routes)
        - [routes](#routes)
        - [routesPath](#routespath)
      - [Custom proxy settings](#custom-proxy-settings)
      - [Env](#env)
      - [Use cloud](#use-cloud)
      - [Target](#target)
      - [useAgent](#useagent)
      - [bounceProd](#bounceprod)
        - [Running PROD proxy without VPN](#running-prod-proxy-without-vpn)
  - [standalone](#standalone)
    - [Usage](#usage)
      - [Simple](#simple)
      - [Advanced](#advanced)
        - [Using provided services](#using-provided-services)
        - [Writing services](#writing-services)
        - [Customizing default services](#customizing-default-services)
- [fec node scripts](#fec-node-scripts)
  - [Usage](#usage-1)
  - [Patch etc hosts](#patch-etc-hosts)
  - [Static](#static)
    - [Inventory example](#inventory-example)
    - [In inventory UI repository changes](#in-inventory-ui-repository-changes)
    - [Compliance frontend setup](#compliance-frontend-setup)
    - [Run servers](#run-servers)
- [include PF css modules in your bundle](#include-pf-css-modules-in-your-bundle)

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
|[proxyURL](#proxyURL)|`string`|URL to proxy Akamai environment requests to.|
|[useChromeTemplate](#useChromeTemplate)|`boolean`|Load chrome HTMl template.|
|[localChrome](#localChrome)|`string`|Path to your local chrome build folder.|
|[keycloakUri](#keycloakUri)|`string`|Uri to inject into proxied chrome assets.|
|[registry](#registry)|`(({ app, server, compiler, standaloneConfig }) => void)[]`|Express middleware to register.|
|[routes](#routes)|`object`|An object with additional routes.|
|[routesPath](#routespath)|`string`|A path to an object with additional routes.|
|[customProxy](#custom-proxy-settings)|`object[]`|An array of custom provided proxy configurations.|
|[env](#env)|`string`|Environment to proxy against such as ci-beta.|
|[useCloud](#use-cloud)|`boolean`|Toggle to use old fallback to cloud.redhat.com paths instead of console.redhat.com.|
|[target](#target)|`string`|Override `env` and `useCloud` to use a custom URI.|
|[useAgent](#useAgent)|`boolean` = `true`|Enforce using the agent to proxy requests via `proxyUrl`.|
|[bounceProd](#bounceProd)|`boolean` = `false`|Bounce all non-GET requests via server requests.|


#### useChromeTemplate

**This option will become the default. App-specific templates are deprecated**

To load chrome HTML template instead of using the APP-specific template add `useChromeTemplate` flag to your config.

```js
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  useProxy: true,
  useChromeTemplate: true
  ...
});
```

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

**The path must end with a slash character / !!**


To check what the proxy is doing with your local chrome settings you can set `proxyVerbose: true`.

#### keycloakUri

You can change which SSO URI insights-chrome uses. Useful when proxying to ephemeral environments. This will be overriden if using `standalone` by `standalone: { chrome: { keycloakUri } }`.

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

#### useAgent

`boolean` = `true`

Enforces using the agent to proxy requests via `proxyUrl`. Setting this to `true` will enforce using agent for PROD environemnt too (use when you are using Red Hat VPN and you do not want to bounce PROD requests). STAGE is using the agent automatically and it cannot be turned off.

#### bounceProd

`boolean` = `false`

Bounce all non-GET PROD requests via server. This option removes all headers except `cookie` and `body` so Akamai won't have issues with different origins/hosts. This behavior allows to access PROD environment without using Red Hat VPN.

##### Running PROD proxy without VPN

Set following attributes in your dev webpack proxy:

```jsx
const config = {
  ...options,
  env: 'prod-stable', // or 'prod-beta'
  useAgent: false,
  bounceProd: true
}
```

Now, you can access PROD env without being connected to Red Hat VPN.

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

# fec node scripts

Executable nodejs scripts available after installing RedHat Cloud Services frontend components - webpack config

## Usage

Use binary in your `package.json` scripts section:
```js
{
  "scripts": {
    "script-name": "fec <script-name> [options]"
  }
}
```

## Patch etc hosts
This is a required step for first time setup. It will allow your localhost to map to [env].foo.redhat.com. This is required to run only once on your machine. **Your OS may require running the script as sudo**!

## Static

A script that will run webpack build and serve webpack output through `http-serve` server. **This is not supposed to replace webpack dev server!**

This script was added due to circular dependency issues when proxying remote containers to another application.
A remote containers can fail to initialize, which makes local development is impossible.

### Inventory example

This example will describe a scenario, when we proxy the inventory remote container (for example the inventory table), to compliance UI for local development purposes.

### In inventory UI repository changes

```diff
diff --git a/package.json b/package.json
index f7513bb..d8c9008 100644
--- a/package.json
+++ b/package.json
@@ -69,7 +69,7 @@
     "@babel/preset-env": "^7.15.6",
     "@babel/preset-react": "^7.14.5",
     "@babel/runtime": "^7.15.4",
-    "@redhat-cloud-services/frontend-components-config": "^4.3.9",
+    "@redhat-cloud-services/frontend-components-config": "^4.4.0",
     "@testing-library/react": "^12.1.0",
     "@wojtekmaj/enzyme-adapter-react-17": "^0.6.3",
     "abortcontroller-polyfill": "^1.7.3",
@@ -103,6 +103,7 @@
     "prod": "NODE_ENV=production webpack serve --config config/dev.webpack.config.js",
     "server:ctr": "node src/server/generateServerKey.js",
     "start": "NODE_ENV=development webpack serve --config config/dev.webpack.config.js",
+    "start:federated": "fec static",
     "start:proxy": "PROXY=true NODE_ENV=development webpack serve --config config/dev.webpack.config.js",
     "travis:build": "NODE_ENV=production webpack --config config/prod.webpack.config.js",
     "travis:verify": "npm-run-all travis:build lint test",
diff --git a/src/components/InventoryTable/NoSystemsTable.js b/src/components/InventoryTable/NoSystemsTable.js
index 75de937..4fc60ab 100644
--- a/src/components/InventoryTable/NoSystemsTable.js
+++ b/src/components/InventoryTable/NoSystemsTable.js
@@ -10,7 +10,7 @@ const NoSystemsTable = () => (
         <Bullseye>
             <EmptyState variant={ EmptyStateVariant.full }>
                 <Title headingLevel="h5" size="lg">
-                    No matching systems found
+                    Local change
                 </Title>
                 <EmptyStateBody>
                     This filter criteria matches no systems. <br /> Try changing your filter settings.

```

### Compliance frontend setup

Note: The `routesPath` was removed because it has higher priority than `routes` config. The proxy config could have also changed in `../config/spandx.config.js` file.

```diff
diff --git a/config/dev.webpack.config.js b/config/dev.webpack.config.js
index 73eb14c..31f6554 100644
--- a/config/dev.webpack.config.js
+++ b/config/dev.webpack.config.js
@@ -32,10 +32,15 @@ const webpackProxy = {
     proxyVerbose: true,
     useCloud: (process.env?.USE_CLOUD === 'true'),
     ...useLocalChrome(),
-    routesPath: process.env.ROUTES_PATH || resolve(__dirname, '../config/spandx.config.js'),
     routes: {
         // Additional routes to the spandx config
         // '/beta/config': { host: 'http://localhost:8003' }, // for local CSC config
+        '/apps/inventory': {
+            host: "http://localhost:8003"
+        },
+        '/beta/apps/inventory': {
+            host: "http://localhost:8003"
+        }
     },
 };

```

### Run servers

```bash
# in the inventory frontend
BETA=true npm run start:federated
# in compliance frontend
BETA=true npm run start:proxy
```

# include PF css modules in your bundle

From version >= 4.5.0 the common config has been setup in a way, that PF styles will no longer be included in webpack build output.
This decision has been made to remove multiple versions of PF styling from the platform and performance improvement. Patternfly styles are now hoste by chrome.
If for some reason(bugs) you want to include PF CSS in your bundle, please use the following config:

```js
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  bundlePfModules: true,
  ...
});

```
