# RedHat Cloud Services frontend components - webpack config

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config)

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
