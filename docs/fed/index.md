# Introduction

Since we are enabling federated modules in chrome apps need to adapt to this change.

This migration update consists of 4 steps

1) Update version of related packages
2) Add federated modules plugin (there's a helper plugin in `@redhat-cloud-services/frontend-components-config/federated-modules` usage of it is optional)
3) Change exporting of your app
4) Add module path to cloudservices config

## Update version of related packages

In order to fully use federated modules you have to update the version of these packages:

```
* webpack: >= 5.9.0
* webpack-cli: >= 4.2.0
* @redhat-cloud-services/frontend-components-config: >= 4.0.0 - if you are using it
```

And change your prod/start scripts (webpack now uses different script to run dev-server)

```
"prod": "NODE_ENV=production webpack serve --config config/dev.webpack.config.js",
"start": "NODE_ENV=development webpack serve --config config/dev.webpack.config.js",
```

## Add federated modules plugin

With all packages updated and installed you should be on good way to fully use new chrome, you just have to enable [federated modules](https://webpack.js.org/concepts/module-federation/).

**optional** Use predefined federated modules plugin. With shared config comes predefined app federated module. To use it just add this to your webpack configs:

```
plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    // exposes: {}, - uncomment and fill in if you want to control what is exposed
    // shared : [], - uncomment and add your shared modules
    // debug: true, - uncomment if you want to see what is used
    // moduleName,  - uncomment if you want to name your module differently 
  })
);
```

If you change `exposes` or `moduleName` prop you have to update config accordingly. 

(If you are using shared config you can skip to [Change exporting of your app](/RedHatInsights/insights-chrome/blob/master/docs/migrationGuide.md#Change-exporting-of-your-app))
If you want to have full control over what is used you can define your own federated module

```
const { ModuleFederationPlugin } = require('webpack').container;

plugins.push(new ModuleFederationPlugin({
  name: 'app1', // (ref1) unique name, should be same as `insights.appname` in your package.json
  filename: `app1.js`, // (ref2)
  library: { type: 'var', name: 'app1' },
  exposes: {
    './RootApp': './src/AppEntry', // (ref3) you can have multiple modules if you want to
    // './SomeCmp': './src/SomeCmp'
  },
  shared: [
    { react: { singleton: true, requiredVersion: dependencies.react } },
    { 'react-dom': { singleton: true, requiredVersion: dependencies['react-dom'] } },
    { 'react-router-dom': { singleton: true, requiredVersion: dependencies['react-router-dom'] } },
    { '@patternfly/react-table': { singleton: true, requiredVersion: dependencies['@patternfly/react-table'] } },
    { '@patternfly/react-core': { singleton: true, requiredVersion: dependencies['@patternfly/react-core'] } },
    { 'react-redux': { singleton: true, requiredVersion: dependencies['react-redux'] } },
  ],
}))
```

However if you do this, please pass `modules: ['app1']` (same name as used in ref1) to `@redhat-cloud-services/frontend-components-config` so we know how to generate fed-modules.json file. Also change your app's config in cloudservices-config so we know what module to use the convention is `ref1#ref3`

## Change exporting of your app

Once you register new federated module you will have to shuffle the way how you export your application.

1) create new file called `AppEntry`
Move everything what is in `entry.js` to it and remove `ReactDOM.render` and use `export default` to export your app.
```
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utilities/store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';

const MyApp = () => (
  // this is just an example here goes everything that was in `entry.js`
  <Provider store={store}>
    <Router basename={getBaseName(location.pathname)}>
      <App />
    </Router>
  </Provider>
);

export default MyApp;

```

2) Remove everything in `entry.js` and replace it with
```
import('./bootstrap');
```

3) The contents of `bootstrap.js` is
```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './AppEntry';

ReactDOM.render(<App />, document.getElementById('root'));
```

## Add module path to cloudservices config

In order for chrome to know how to bootstrap your app you have to indicate what module is used to this action. You have 2 options how to register new chrome 2.0 usage

1) magic link - add new key `module: YOUR_MODULE_NAME#./RootApp` under frontend object. If you used predefined config the magic link should be same as what is under `insights.appname` in your package.json. If you changed `moduleName` or `exposes` please reflect that in here as well (`module: $moduleName#./$exposes` - replace with your values). If you used custom federated module plugin your magic link will be `module ref1#ref2` (replace `ref1` and `ref2` with actual value).
2) complex value - if you want to have full control over what is used you can specify complex value for `module`
```
module:
  appName: $APP_NAME # your actuall application name
  scope: app1 # defined in ref1
  module: ./RootApp # defined in ref3
  fileName: 'js/folder/manifest.json' # optional, if you are building custom manifest
```
### Notes

If you are using predefined module federation plugin we expect that you created `AppEntry` and exported your application as default export. However you can name your file however you want, just update `exposes: { './RootApp': './src/FileName' } `.

The name of your exposed module can be changed as well by changing the `exposes: { './SomeInterestingName': './src/AppEntry' }`. Just bear in mind, that changing this requires update in cloudservices config, so we know what entry to use when bootstrapping your application.

You can have as many federated modules exposed in one plugin as you want to, we don't limit you in this.

If you want you can have multiple module federation plugins as well, this can be usefull for sharing some of your code with other apps as well, we have plugin that generates manifest for us just don't forget to add `modules: LIST_OF_YOUR_MODULES ]` when using shared config.

### Not using shared config

If you are not using shared config you have to also generate manifest for chrome so we know where to load the app's bootstrap file.

**optional** use `@redhat-cloud-services/frontend-components-config/chunk-mapper`. The plugin that we use to define manifest can be used without using the shared config
```
const ChunkMapper = require('@redhat-cloud-services/frontend-components-config/chunk-mapper');
{
    // rest of your webpack config
    plugins: [
        // rest of your plugins
        new ChunkMapper({
            modules: [ 'app1' ] // list of your federated modules
        })
    ]
}
```

The final manifest should be located in your `dist` folder and have name `fed-mods.json`, optionally you can set the name of the file in cloudservices config `manifest: js/folder/custom-manifest.json`.

The shape of your manifest should be
```
{
    "app1": { // same name as in ref1
        "entry": ["/apps/starter-app/app1.js"] // value passed in ref2 denoted with `/apps/$APP_NAME`
    }
}
```
