/* eslint-disable no-console */
import { relative, resolve } from 'path';
import { DynamicRemotePlugin, EncodedExtension, PluginBuildMetadata, WebpackSharedConfig } from '@openshift/dynamic-plugin-sdk-webpack';
import jsVarName from './jsVarName';

const defaultPluginMetaDataJSON = {
  version: '1.0.0',
  extensions: [],
};

const createIncludes = (eager = false): { [module: string]: WebpackSharedConfig } => ({
  '@patternfly/react-core': { eager },
  '@patternfly/react-table': { eager },
  '@patternfly/react-tokens': {},
  '@patternfly/react-icons': {},
  '@patternfly/quickstarts': { singleton: true, eager },
  '@redhat-cloud-services/chrome': { singleton: true },
  '@redhat-cloud-services/frontend-components': {},
  '@redhat-cloud-services/frontend-components-utilities': {},
  '@redhat-cloud-services/frontend-components-notifications': {},
  axios: {},
  lodash: {},
  'redux-promise-middleware': {},
  react: { singleton: true, eager },
  'react-dom': { singleton: true, eager },
  'react-router-dom': { eager },
});

export type FederatedModulesConfig = {
  root: string;
  exposes?: { [module: string]: string };
  shared?: { [module: string]: WebpackSharedConfig }[];
  debug?: boolean;
  moduleName?: string;
  useFileHash?: boolean;
  separateRuntime?: boolean;
  exclude?: string[];
  /**
   *  @deprecated
   * Using eager loading will bloat your build output
   */
  eager?: boolean;
  pluginMetadata?: PluginBuildMetadata;
  extensions?: EncodedExtension[];
};

function hasVersionSpecified(config: { [module: string]: WebpackSharedConfig }): config is {
  [module: string]: Omit<WebpackSharedConfig, 'requiredVersion'> & {
    requiredVersion: string;
  };
} {
  return Object.values(config).every((c) => typeof c.version === 'string');
}

const federatedModules = ({
  root,
  exposes,
  shared = [],
  debug,
  moduleName,
  useFileHash = true,
  separateRuntime = false,
  exclude = [],
  eager = false,
  pluginMetadata,
  extensions = [],
}: FederatedModulesConfig) => {
  const include = createIncludes(eager);

  const { dependencies, insights } = require(resolve(root, './package.json')) || {};
  const appName = moduleName || (insights && jsVarName(insights.appname));
  const filename = `${appName}.${useFileHash ? `[fullhash].` : ''}js`;

  let sharedDeps = Object.entries(include)
    .filter(([key]) => dependencies[key] && !exclude.includes(key))
    .map(([key, val]) => ({
      [key]: {
        requiredVersion: dependencies[key],
        ...val,
      },
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  // FIXME: Add tests for this
  shared.forEach((dep) => {
    if (!hasVersionSpecified(dep)) {
      const invalidDeps = Object.entries(dep)
        .filter(([, { version }]) => typeof version !== 'string')
        .map(([moduleName]) => moduleName);
      throw new Error('Some of your shared dependencies do not have version specified! Dependencies with no version: ' + invalidDeps);
    }
    sharedDeps = {
      ...sharedDeps,
      ...dep,
    };
  });
  /**
   * Add scalprum and force it as singleton.
   * It is required to share the context via `useChrome`.
   * No application should be installing/interacting with scalprum directly.
   */
  if (dependencies['@redhat-cloud-services/frontend-components']) {
    sharedDeps['@scalprum/react-core'] = { requiredVersion: '*', singleton: true, eager };
  }

  /**
   * Make sure the unleash proxy client is a singleton
   */
  if (dependencies['@unleash/proxy-client-react']) {
    sharedDeps['@unleash/proxy-client-react'] = { singleton: true, requiredVersion: dependencies['@unleash/proxy-client-react'] };
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

  const pluginMetadataInternal = {
    ...defaultPluginMetaDataJSON,
    name: appName,
    ...pluginMetadata,
    exposedModules: {
      ...(exposes || {
        './RootApp': `./${relative(root, './src/AppEntry')}`,
      }),
    },
  };

  const dynamicPlugin = new DynamicRemotePlugin({
    extensions,
    sharedModules: sharedDeps,
    entryScriptFilename: filename,
    moduleFederationSettings: {
      libraryType: separateRuntime ? 'var' : 'jsonp',
    },
    pluginManifestFilename: 'fed-mods.json',
    pluginMetadata: pluginMetadataInternal,
  });

  return dynamicPlugin;
};

export default federatedModules;
module.exports = federatedModules;
