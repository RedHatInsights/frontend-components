/* eslint-disable no-console */
const { resolve } = require('path');
const { ModuleFederationPlugin } = require('webpack').container;
const jsVarName = require('./jsVarName');

const include = {
  '@patternfly/react-core': { eager: true },
  '@patternfly/react-table': { eager: true },
  '@patternfly/react-tokens': {},
  '@patternfly/react-icons': {},
  '@patternfly/quickstarts': { singleton: true, eager: true },
  '@redhat-cloud-services/frontend-components': {},
  '@redhat-cloud-services/frontend-components-utilities': {},
  '@redhat-cloud-services/frontend-components-notifications': {},
  axios: {},
  lodash: {},
  'redux-promise-middleware': {},
  react: { singleton: true, eager: true },
  'react-dom': { singleton: true, eager: true },
  'react-router-dom': { eager: true },
};

module.exports = ({ root, exposes, shared = [], debug, moduleName, useFileHash = true, libType = 'var', libName, exclude = [] }) => {
  const { dependencies, insights } = require(resolve(root, './package.json')) || {};
  const appName = moduleName || (insights && jsVarName(insights.appname));

  const sharedDeps = Object.entries(include)
    .filter(([key]) => dependencies[key] && !exclude.includes(key))
    .map(([key, val]) => ({
      [key]: {
        requiredVersion: dependencies[key],
        ...val,
      },
    }));

  /**
   * Add scalprum and force it as singletong.
   * It is required to share the context via `useChrome`.
   * No application should be installing/interacting with scalprum directly.
   */
  if (dependencies['@redhat-cloud-services/frontend-components']) {
    sharedDeps.push({ '@scalprum/react-core': { requiredVersion: '*', singleton: true } });
  }

  /**
   * Make sure the unleash proxy client is a singleton
   */
  if (dependencies['@unleash/proxy-client-react']) {
    sharedDeps.push({ '@unleash/proxy-client-react': { singleton: true, requiredVersion: dependencies['@unleash/proxy-client-react'] } });
  }

  if (debug) {
    console.log('Using package at path: ', resolve(root, './package.json'));
    console.log('Using appName: ', appName);
    console.log(`Using ${exposes ? 'custom' : 'default'} exposes`);
    console.log('Number of custom shared modules is: ', shared.length);
    console.log('Number of default shared modules is: ', sharedDeps.length);
    if (exclude.length > 0) {
      console.log('Excluding default packages', exclude);
    }
  }

  return new ModuleFederationPlugin({
    name: appName,
    filename: `${appName}${useFileHash ? `.${Date.now()}.[fullhash]` : ''}.js`,
    library: { type: libType, name: libName || appName },
    exposes: {
      ...(exposes || {
        './RootApp': resolve(root, './src/AppEntry'),
      }),
    },
    shared: [...sharedDeps, ...shared],
  });
};
