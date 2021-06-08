# RedHat Cloud Services frontend components - webpack config

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config)

- [RedHat Cloud Services frontend components - webpack config](#redhat-cloud-services-frontend-components---webpack-config)
  - [Webpack 5](#webpack-5)
    - [Removed features with webpack 5](#removed-features-with-webpack-5)
  - [useProxy](#useproxy)
    - [Attributes](#attributes)
    - [Utilities](#utilities)
    - [localChrome](#localchrome)
    - [Custom routes](#custom-routes)
      - [routes](#routes)
      - [routesPath](#routespath)
    - [Custom proxy settings](#custom-proxy-settings)
    - [Application entry url](#application-entry-url)
      - [Different environments](#different-environments)
      - [Multiple HTML entrypoints](#multiple-html-entrypoints)
      - [Exact URL](#exact-url)
    - [cookieTransform](#cookietransform)
      - [custom entitlements](#custom-entitlements)
    - [Serving local files](#serving-local-files)
      - [Example](#example)

## Webpack 5

In order to use the new version of webpack and its federated medules you'll have to change your run script to use new [`webpack serve`](https://webpack.js.org/configuration/dev-server/).
```JS
> webpack-dev-server -> webpack serve
```

You'll also have to update your `webpack-cli` dependency to `>=4.2.0`, this package has `peerDependency` on it so you should see warning in your console.

### Removed features with webpack 5

The new version of webpack 5 changed polyfills and plugin configs, some packages are outdated, one example is `lodash-webpack-plugin` this plugin is no longer maintain anyways. You should be just fine by installing `lodash` directly, imports can stay the same as before `import get from 'lodash/get'`.


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

Then you will find your application running on `https://(ci/qa/prod).foo.redhat.com:1337(/beta)/...`. This works only with **Chrome 2** ready applications. To get Chrome 1 applications to work, you have to also set the [appUrl](#application-entry-url) attribute.

### Attributes

|Attribute|Type|Description|
|---------|----|-----------|
|[useProxy](#useproxy)|`boolean`|Enables webpack proxy.|
|[appUrl](#application-entry-url)|`string`\|`string[]`|An entrypoint for your application. Can be a single string or an array of multiple points. The proxy is firstly trying to match the entrypoint with an html file, but if this file does not exist, it's redirected to `index.html`.|
|[exactUrl](#exact-url)|`boolean`|When enabled, the appUrl is matched only when the url is the same as the string.|
|[localChrome](#localchrome)|`string`|Path to your local chrome build folder.|
|[routes](#routes)|`object`|An object with additional routes.|
|[routesPath](#routespath)|`string`|A path to an object with additional routes.|
|[customProxy](#custom-proxy-settings)|`object[]`|An array of custom provided proxy configurations.|
|disableFallback|`boolean`|Disables fallback index.html for `appUrl`.|
|proxyVerbose|`boolean`|Shows basic log in the server console.|

### Utilities

|name|import|description|
|----|------|-----------|
|[serverLocalFile](#serving-local-files)|`@redhat-cloud-services/frontend-components-config-utilities/serveLocalFile`|Creates a config for serving single local files.|
|[cookieTransform](#cookietransform)|`@redhat-cloud-services/frontend-components-config-utilities/cookieTransform`|Converts jwt-token to `x-rh-identity` header.|
|[router](#different-environments)|`@redhat-cloud-services/frontend-components-config-utilities/router`|Redirects requests based on the current environment.|
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
// /home/khala/Documents/git/RedHatInsights/spandx.config.js
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

### Application entry url

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

#### Different environments

The proxy config automatically routes requests to the correct target.

```jsx
case 'ci.foo.redhat.com':    return 'https://ci.cloud.redhat.com/';
case 'qa.foo.redhat.com':    return 'https://qa.cloud.redhat.com/';
case 'stage.foo.redhat.com': return 'https://cloud.stage.redhat.com/';
case 'prod.foo.redhat.com':  return 'https://cloud.redhat.com/';
```

This `router` function is also available as a seperate module:

```jsx
const router = require('@redhat-cloud-services/frontend-components-config-utilities/router');

...

{
  ...
  customProxy: [
    {
      context: (path) => path.includes('/api/'),
      target: defaultTarget,
      // high-order function returning the router function (req) => ....
      // defaultTarget can be empty, it is just a fallback
      router: router(defaultTarget),
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
    },
  ],
}

```
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
`redhat.com/beta/app` won`t be redirected to any of your local files

In both cases queries and hashes are ignored.

### cookieTransform

For running local services you can use `cookieTransform` ([original function](https://github.com/RedHatInsights/insights-standalone/blob/1eef6cfc21f96304275683d090c6b8178a4d386f/index.js#L8), you can also check [insights-proxy implementation](https://github.com/RedHatInsights/insights-proxy/blob/1cdbc597681eac51998d8c2dd2dd6b5a2d4d03d6/spandx.config.js#L101)) in `onProxyReq` function. This function transform `jwt` cookie to `x-rh-identity` header.

```jsx
const cookieTransform = require('@redhat-cloud-services/frontend-components-config-utilities/cookieTransform');

onProxyReq: (...args) => {
    cookieTransform(...args);
},
```

Routes passed via `routes` or `routesFile` attributes are using this transform automatically. If you override the `onProxyReq` function, you have to add it back manually.

#### custom entitlements

By default, the same entitlements as in insights-proxy are provided. You can rewrite them via the options object:

```jsx
cookieTransform(proxyReq, req, res, { entitlements });
```

You can also modify the whole identity object:

```jsx
cookieTransform(proxyReq, req, res, { entitlements, identity, user, internal });
```


### Serving local files

To serve a local file (such as `cloud-services-config`) you can use `serveLocalFile` function.

*(url, filePath, target = 'https://ci.cloud.redhat.com') => proxyConfig*

**url**

Url of proxied file, it matches using `path.includes(url)`.

**filePath**

A path to your local file.

**target**

A current target. By default `https://ci.cloud.redhat.com`.

#### Example

```jsx
const serverLocalFile = require('@redhat-cloud-services/frontend-components-config-utilities/serveLocalFile');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  appUrl: `/beta/settings/applications`,
  customProxy: [
    serveLocalFile(
      '/beta/config/main.yml', // url
      '/Users/rvsiansk/insights-project/cloud-services-config/main.yml' // localFile path
    ),
  ],
});
```
