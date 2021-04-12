# RedHat Cloud Services frontend components - webpack config

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config)

- [RedHat Cloud Services frontend components - webpack config](#redhat-cloud-services-frontend-components---webpack-config)
  - [Webpack 5](#webpack-5)
    - [Removed features with webpack 5](#removed-features-with-webpack-5)
  - [useProxy](#useproxy)
    - [localChrome](#localchrome)
    - [Custom routes](#custom-routes)
      - [routes](#routes)
      - [routesPath](#routespath)
    - [Custom proxy settings](#custom-proxy-settings)
    - [Chrome 1 environments](#chrome-1-environments)
      - [Prod environment example](#prod-environment-example)
      - [Multiple HTML entrypoints](#multiple-html-entrypoints)
      - [Exact URL](#exact-url)

## Webpack 5

In order to use the new version of webpack and its federated medules you'll have to change your run script to use new [`webpack serve`](https://webpack.js.org/configuration/dev-server/).
```JS
> webpack-dev-server -> webpack serve
```

You'll also have to update your `webpack-cli` dependency to `>=4.2.0`, this package has `peerDependency` on it so you should see warning in your console.

### Removed features with webpack 5

The new version of webpack 5 changed plyfills and plugin configs, some packages are outdated, one example is `lodash-webpack-plugin` this plugin is no longer maintain anyways. You should be just fine by installing `lodash` directly, imports can stay the same as before `import get from 'lodash/get`.


## useProxy

The config provide a way to run your applications without using insights-proxy. Just add `useProxy: true` to your configuration.

```jsx
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
});
```

And run your application with following command:

```shell
NODE_ENV=development BETA=true webpack serve --config config/dev.webpack.config.js
```

*Path to config can be different*

Then you will find your application running on `https://ci.foo.redhat.com:1337/beta/...`. This works only with **Chrome 2** ready applications.

You can change the environment by setting `betaEnv`, but unless the targeted environment is using Chrome 2.0, it won't work correctly.

### localChrome

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

### Custom routes

If you want to serve files or api from different URL you can either pass `routes` to config or `routesPath` for file which exports these routes.

#### routes

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

#### routesPath

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
module.exports = {
  routes: {
    '/api': { host: 'PORTAL_BACKEND_MARKER' },
    '/config': { host: 'http://127.0.0.1:8889' },
    '/beta/config': { host: 'http://127.0.0.1:8889' },
  }
};

```

### Custom proxy settings

You can add any additional custom proxy configuration. See [Webpack documentation](https://webpack.js.org/configuration/dev-server/#devserverproxy). Please, provide your configuration as an array of object containing `context` property.

*Example*:

```jsx
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  localChrome: process.env.INSIGHTS_CHROME,
  customProxy: [
    {
      context: (path) => path.includes('/api/'),
      target: 'https://qa.cloud.redhat.com',
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
    },
  ],
});
```

This configuration will redirect all API requests to QA environment, so you can check CI UI with QA data.

### Chrome 1 environments

To run your application in Chrome 1 environment, just add `appUrl` that contains entry url for your application.

```jsx
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  appUrl: process.env.BETA ? '/beta/settings/sources' : '/settings/sources'
});
```

This settings will redirect all requests to `appUrl` to your local `index.html` file and will replace ESI tags for Chrome.

By default, all subroutes are (`/beta/settings/sources/new`) will be redirected to `index.html`, you can disable this behavior by setting `disableFallback: true`.

#### Prod environment example

```jsx
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  betaEnv: 'prod',
  appUrl: process.env.BETA ? '/beta/settings/sources' : '/settings/sources'
});
```

Then go to `https://prod.foo.redhat.com:1337/` and you should be able to login and use your local UI build within production environment.

#### Multiple HTML entrypoints

If your application has multiple HTML entrypoints, you can set an array of values in `appUrl`:

*Following example shows landing-page configuration*

```jsx
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  appUrl: ['/beta/maintenance.html', '/beta/'],
});
```

#### Exact URL

In default, all requests **containing** your app url are redirected to local file. If you want to check the exact URL, you can do it via `exactUrl`

```jsx
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  appUrl: ['/beta/maintenance.html', '/beta/'],
  exactUrl: true,
});
```

`redhat.com/beta/` will be redirected to your local `index.html` file
`redhat.com/beta/app` won`t be redirect to any of your local files

In both cases queries and hashes are ignored.
