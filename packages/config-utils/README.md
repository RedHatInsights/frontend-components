# RedHat Cloud Services frontend components - webpack config utilities

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config-utilities.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config-utilities)

- [RedHat Cloud Services frontend components - webpack config utilities](#redhat-cloud-services-frontend-components---webpack-config-utilities)
  - [Chrome render loader](#chrome-render-loader)
    - [Disable chrome 2](#disable-chrome-2)
  - [Chunk mapper](#chunk-mapper)
  - [Federated modules](#federated-modules)
    - [Override container ports](#override-container-ports)
      - [List of shared deps](#list-of-shared-deps)
  - [Extensions plugin](#extensions-plugin)
    - [Arguments](#arguments)
    - [`pluginConfig`](#pluginconfig)
      - [extension object](#extension-object)

## Chrome render loader

When using chrome 2 and user refreshes a page on your application you may end up with 2 instances of your application in virtual DOM. This loader prevents it by wrapping your app in condition to check if chrome 2 config is enabled.

The appName should be same as is `insights.appname` in your `package.json`.

```JS
{
  module: {
    rules: [{
      test: new RegExp(appEntry),
      loader: path.resolve(__dirname, './chrome-render-loader.js'),
      options: {
        appName: 'name-of-your-app',
      }
    }]
}
}
```

### Disable chrome 2

When migrating application to chrome 2 you may want to disable this for some time, otherwise you'll have to sync pushes to all branches with [CSC](https://github.com/RedHatInsights/cloud-services-config).

```JS
{
  module: {
    rules: [{
      test: new RegExp(appEntry),
      loader: '@redhat-cloud-services/frontend-components-config-utilities/chrome-render-loader',
      options: {
        appName: 'name-of-your-app',
        skipChrome2: true
      }
    }]
  }
}
```

## Chunk mapper

To properly load files in chrome 2 you have to generate mapper to each exported chunk. This webpack plugin will do that for you.

```JS
const ChunkMapper = require('@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper');

{
  plugins: [
    new ChunkMapper({
      // prefix: '/some-path/', // optional - defaults to output.publicPath
      modules: [], //required
    })
  ]
}
```

* `prefix` - if you have your federated modules files located under some different path than `output.publicPath`
* `modules` - either string or an array of strings to indicate which generated files should be picked up (generally your `insights.appname` - if you have dashes in your name replace them with cammel case)

## Federated modules
If you don't want to dig trough  webpack's [module-federation/](https://webpack.js.org/concepts/module-federation/) and write custom generator you can use this wrapper.

```JS
plugins.push(
    require('@redhat-cloud-services/frontend-components-config/federated-modules')({
        root: resolve(__dirname, '../'),
        // exposes: { './RootApp': './src/AppEntry.js' },
        // shared: [{ react: { singleton: true, requiredVersion: 17.0.0 } }],
        // debug: true,
        // moduleName: 'someAppName',
        // useFileHash: false,
        // exclude: ['react']
    })
);
```

We've aimed for easy plug and play, but feel free to override any fed mods partials with these arguments:

* `root` - root of you application (to find out `package.json`)
* `exposes` - which files and modules should be exposed
* `shared` - federated modules allow for sharing of dependencies, we've added some general dependencies, but feel free to expand them via this prop
* `debug` - to see full output what is going to be used
* `moduleName` - used to generate the file under this name (generally your `insights.appname` - if you have dashes in your name replace them with cammel case)
* `useFileHash` - in order to prevent caching we are using file hashes, you might want to turn this off in your dev env
* `exclude` - if you want to exclude any shared module you can do it trough here (even for general dependencies added by us)
* `eager` - if set to `true`, turns eager fetch for shared modules on

### Override container ports
The default ports for the RBAC server(**4012**) and/or the Keycloak server(**4001**) can be overridden using a corresponding variable in the environment. 

  Bash examples:

      export KEYCLOAK_PORT=4020
      export RBAC_PORT=5000


#### List of shared deps

This packages exposes these federated shared dependencies
* `lodash` - version taken from your `package.json`
* `axios` - version taken from your `package.json`
* `redux` - version taken from your `package.json`
* `react` - version taken from your `package.json`, treated as singleton
* `react-dom` - version taken from your `package.json`, treated as singleton
* `react-router-dom` - version taken from your `package.json`
* `react-redux` - version taken from your `package.json`
* `redux-promise-middleware` - version taken from your `package.json`
* `@patternfly/react-table` - version taken from your `package.json`
* `@patternfly/react-core` - version taken from your `package.json`
* `@patternfly/react-icons` - version taken from your `package.json`
* `@patternfly/react-tokens` - version taken from your `package.json`
* `@redhat-cloud-services/frontend-components` - version taken from your `package.json`
* `@redhat-cloud-services/frontend-components-utilities` - version taken from your `package.json`
* `@redhat-cloud-services/frontend-components-notifications` - version taken from your `package.json`

## Extensions plugin

In order to share some code into extension points or to add new extension point we can use `ExtensionsPlugin`

Simply import it in your webpack config and add it to your plugins

```JS
const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const ExtensionsPlugin = require('@redhat-cloud-services/frontend-components-config/extensions-plugin');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  ...(process.env.BETA && { deployment: 'beta/apps' }),
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
  }),
  new ExtensionsPlugin({})
);

module.exports = {
  ...webpackConfig,
  plugins
}
```

### Arguments

There are three arguments `ExtensionsPlugin` constructor accepts:
* `pluginConfig`
* `fedModuleConfig`
* `options`

### `pluginConfig`

This config contains information about extensions, plugin requirements, its name and description. Most of it (name, description and version) is calculated from your root `package.json`. But you can override these values:

* `name` - plugin name (pulled from `package.json`)
* `version` - version of the plugin
* `displayName` - display name of the plugin
* `description` - description of the plugin (pulled from `package.json`)
* `dependencies` - object of dependencies which will be passed down to module federation (no need to list general react dependencies)
* `disableStaticPlugins` - list of static plugins this plugin disables on load
* `extensions` - list of extension objects.

#### extension object

Each extension object requires a `type` and `properties`. The type can be either custom extension or one of predefined:

* `console.navigation/section` - a section in navigation (identifies secondary nav)
  * `properties`
    * `id` - id of the section
    * `name` - name of the section, this will be shown in the UI
* `console.page/route` - route passed to react-router
  * `properties` - in theory any react-router path prop can be used here
    * `path` - (string, or array) path on which the component will be rendered
    * `component`
      * `$codeRef` - federated module used to render on the route
* `console.navigation/href` - navigation href, used to render leafs of navigation
  * `properties`
    * `id` - id of the href
    * `section` - (optional) used to group nav items under section (omit for flat nav)
    * `name` - name of the href, thiw will be shown in the UI
    * `href` - used to mutate the URL
