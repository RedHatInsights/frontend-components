# Frontend components config

Configuration options of the `@redhat-cloud-services/frontend-components-config` package.

## `sassPrefix`

Each module uses a unique CSS class to prefix all application-specific styles. This is to make sure one application styling will not affect others.

By default, `insights.appname` string is used.

```jsx
/** 
 * RBAC UI webpack config
*/
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  sassPrefix: '.rbac', // <- sass prefix config
  ...(process.env.PROXY ? webpackProxy : insightsProxy),
});

```


### `insights.appname`&nbsp;include a dash character (-)

Federated modules cannot parse the **-** character. That means your **default** sass prefix won't work. Styles will not be applied!

To fix the issue add ***sassPrefix*** in camelCase:

```jsx
// insights.appname is equal to "my-new-app"
const config = require('@redhat-cloud-services/frontend-components-config');

const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  sassPrefix: '.my-new-app, .myNewApp', // <- sass prefix config
});

```

## Speed up development builds

You can enable the <a href="/frontend-components-config/use-cache">useCache</a> flag to boost your dev build bootsrap.
