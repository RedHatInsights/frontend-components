/* eslint-disable no-console */
import { relative, resolve } from 'path';
import { DynamicRemotePlugin, EncodedExtension, PluginBuildMetadata, WebpackSharedConfig } from '@openshift/dynamic-plugin-sdk-webpack';
import fecLogger, { LogType } from './fec-logger';
import jsVarName from './jsVarName';

const defaultPluginMetaDataJSON = {
  version: '1.0.0',
  extensions: [],
};

const createIncludes = (): { [module: string]: WebpackSharedConfig } => ({
  '@patternfly/quickstarts': { singleton: true, eager: false, import: false },
  '@redhat-cloud-services/chrome': { singleton: true, import: false },
  axios: {},
  lodash: {},
  react: { singleton: true, eager: false, import: false },
  'react-dom': { singleton: true, eager: false, import: false },
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
  pluginMetadata,
  extensions = [],
}: FederatedModulesConfig) => {
  const include = createIncludes();

  const { dependencies, insights } = require(resolve(root, './package.json')) || {};
  const appName = moduleName || (insights && jsVarName(insights.appname));
  const filename = `${appName}.${useFileHash ? `[contenthash].` : ''}js`;

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
  if (dependencies['@redhat-cloud-services/frontend-components'] || dependencies['@scalprum/react-core'] || dependencies['@scalprum/core']) {
    sharedDeps['@scalprum/react-core'] = { requiredVersion: '*', singleton: true, eager: false, import: false };
    sharedDeps['@scalprum/core'] = { requiredVersion: '*', singleton: true, eager: false, import: false };
  }

  /**
   * Make sure the unleash proxy client is a singleton
   */
  if (dependencies['@unleash/proxy-client-react']) {
    sharedDeps['@unleash/proxy-client-react'] = {
      singleton: true,
      eager: false,
      import: false,
      requiredVersion: dependencies['@unleash/proxy-client-react'],
    };
  }

  if (debug) {
    fecLogger(LogType.info, 'Using package at path: ', resolve(root, './package.json'));
    fecLogger(LogType.info, 'Using appName: ', appName);
    fecLogger(LogType.info, `Using ${exposes ? 'custom' : 'default'} exposes`);
    fecLogger(LogType.info, 'Number of custom shared modules is: ', shared.length);
    fecLogger(LogType.info, 'Number of default shared modules is: ', sharedDeps.length);
    if (exclude.length > 0) {
      fecLogger(LogType.info, 'Excluding default packages', exclude);
    }
  }

  if (!exposes) {
    fecLogger(LogType.warn, 'No exposed modules provided! Falling back to ./src/AppEntry as "./RootApp"');
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
