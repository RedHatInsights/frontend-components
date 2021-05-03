# RedHat Cloud Services frontend components - webpack config utilities

[![npm version](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config-utilities.svg)](https://badge.fury.io/js/%40redhat-cloud-services%2Ffrontend-components-config-utilities)

- [RedHat Cloud Services frontend components - webpack config](#redhat-cloud-services-frontend-components---webpack-config-utilities)
  - [Chrome render loader](#chrome-render-loaded)
    - [Disable chrome 2](#disable-chrome-2)
  - [Chunk mapper](#chunk-mapper)
  - [Federated modules](#federated-modules)

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
