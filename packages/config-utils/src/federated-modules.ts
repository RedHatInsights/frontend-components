/* eslint-disable no-console */
import { relative, resolve } from 'path';
import { DynamicRemotePlugin, EncodedExtension, PluginBuildMetadata, WebpackSharedConfig } from '@openshift/dynamic-plugin-sdk-webpack';
import jsVarName from './jsVarName';
import fecLogger, { LogType } from './fec-logger';

const defaultPluginMetaDataJSON = {
  version: '1.0.0',
  extensions: [],
};

/**
 * Returns the three groups that make up the shared-module baseline:
 * - chromeProvided: singletons owned by insights-chrome (non-overridable)
 * - defaultShared: convenience sharing (axios, lodash) tenants can override
 * - impliedDeps: trigger → targets map for transitive chrome deps (see applyImpliedDeps)
 *
 * react/jsx-dev-runtime is the exception in chromeProvided: dev-only and not
 * registered by chrome, so it lacks import: false (tenant bundles it).
 */
export const createIncludes = (): {
  chromeProvided: Record<string, WebpackSharedConfig>;
  defaultShared: Record<string, WebpackSharedConfig>;
  impliedDeps: Record<string, string[]>;
} => ({
  // Modules dictated by insights-chrome. The singleton, import, and eager
  // properties are enforced by fec and cannot be overridden by tenants.
  chromeProvided: {
    react: { singleton: true, eager: false, import: false },
    'react-dom': { singleton: true, eager: false, import: false },
    'react/jsx-runtime': { singleton: true, eager: false, import: false },
    'react/jsx-dev-runtime': { singleton: true, eager: false }, // dev-only: not provided by chrome, tenant bundles it
    'react-intl': { singleton: true, eager: false, import: false },
    'react-router-dom': { singleton: true, eager: false, import: false },
    '@openshift/dynamic-plugin-sdk': { singleton: true, eager: false, import: false },
    '@patternfly/quickstarts': { singleton: true, eager: false, import: false },
    '@redhat-cloud-services/chrome': { singleton: true, import: false },
    '@scalprum/core': { singleton: true, eager: false, import: false },
    '@scalprum/react-core': { singleton: true, eager: false, import: false },
    '@unleash/proxy-client-react': { singleton: true, eager: false, import: false },
  },
  // Convenience sharing — tenants can override or exclude freely
  defaultShared: {
    axios: {},
    lodash: {},
  },
  // Transitive triggers: if a trigger package is in dependencies,
  // the listed chrome-provided modules are added with requiredVersion: '*'
  impliedDeps: {
    '@redhat-cloud-services/frontend-components': ['@scalprum/core', '@scalprum/react-core'],
  },
});

export type FederatedModulesConfig = {
  root: string;
  /**
   * Explicit dependency map. If provided, package.json is not read from disk.
   * Intended for testing — production callers should omit this and rely on root.
   */
  dependencies?: Record<string, string>;
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

const getRootPackage = (key: string): string => {
  if (key.startsWith('@')) {
    // scoped: @scope/pkg/subpath → @scope/pkg
    return key.split('/').slice(0, 2).join('/');
  }
  // unscoped: react/jsx-runtime → react
  return key.split('/')[0];
};

/**
 * Filters the combined include set down to modules the tenant has in
 * dependencies, then stamps each with requiredVersion. Subpath exports
 * (react/jsx-runtime) resolve their version from the root package (react)
 * via getRootPackage.
 */
export const createSharedDeps = (
  include: { [module: string]: WebpackSharedConfig },
  dependencies: { [pkg: string]: string },
  exclude: string[]
): { [module: string]: WebpackSharedConfig } =>
  Object.entries(include)
    .filter(([key]) => dependencies[getRootPackage(key)] && !exclude.includes(key))
    .map(([key, val]) => ({
      [key]: {
        requiredVersion: dependencies[getRootPackage(key)],
        ...val,
      },
    }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

/**
 * Injects chrome-provided singletons the tenant needs transitively. Example:
 * @redhat-cloud-services/frontend-components depends on @scalprum/core
 * internally, so tenants using it need @scalprum/core in the shared scope
 * even without a direct dependency. Injected with requiredVersion: '*';
 * targets already in sharedDeps (direct deps) are left untouched.
 */
export const applyImpliedDeps = (
  sharedDeps: Record<string, WebpackSharedConfig>,
  include: Record<string, WebpackSharedConfig>,
  dependencies: Record<string, string>,
  impliedDeps: Record<string, string[]>
): Record<string, WebpackSharedConfig> => {
  const result = { ...sharedDeps };
  for (const [trigger, targets] of Object.entries(impliedDeps)) {
    if (dependencies[trigger]) {
      for (const target of targets) {
        if (!result[target] && include[target]) {
          result[target] = { requiredVersion: '*', ...include[target] };
        }
      }
    }
  }
  return result;
};

/**
 * Merges the tenant's shared[] on top of the auto-generated shared map.
 * Chrome-provided entries are filtered out before merging (with a warning) —
 * tenants cannot override them. Use shared[] for genuinely custom cross-app
 * modules (e.g. a shared Zustand store between two apps in the same org).
 * Non-chrome entries must have a version field or an error is thrown.
 */
export const mergeSharedDeps = (
  sharedDeps: Record<string, WebpackSharedConfig>,
  shared: Record<string, WebpackSharedConfig>[],
  chromeProvided: Record<string, WebpackSharedConfig>,
  logger = fecLogger
): Record<string, WebpackSharedConfig> => {
  return shared.reduce((acc, dep) => {
    // Chrome-provided modules cannot be configured by tenants — filter and warn
    const tenantOnly = Object.fromEntries(
      Object.entries(dep).filter(([key]) => {
        if (chromeProvided[key]) {
          logger(LogType.warn, `"${key}" is provided by insights-chrome and cannot be configured via shared[]. Entry ignored.`);
          return false;
        }
        return true;
      })
    );
    if (!hasVersionSpecified(tenantOnly)) {
      const invalidDeps = Object.entries(tenantOnly)
        .filter(([, { version }]) => typeof version !== 'string')
        .map(([moduleName]) => moduleName);
      throw new Error('Some of your shared dependencies do not have version specified! Dependencies with no version: ' + invalidDeps);
    }
    return { ...acc, ...tenantOnly };
  }, sharedDeps);
};

function hasVersionSpecified(config: { [module: string]: WebpackSharedConfig }): config is {
  [module: string]: Omit<WebpackSharedConfig, 'version'> & {
    version: string;
  };
} {
  return Object.values(config).every((c) => typeof c.version === 'string');
}

const federatedModules = ({
  root,
  dependencies: depsProp,
  exposes,
  shared = [],
  debug,
  moduleName,
  useFileHash = true,
  separateRuntime = false,
  exclude = [],
  pluginMetadata,
  extensions = [],
}: FederatedModulesConfig): DynamicRemotePlugin => {
  const { chromeProvided, defaultShared, impliedDeps } = createIncludes();
  const include = { ...chromeProvided, ...defaultShared };

  const { dependencies = {}, insights } = depsProp
    ? { dependencies: depsProp, insights: undefined }
    : require(resolve(root, './package.json')) || {};
  const appName = moduleName || (insights && jsVarName(insights.appname));
  const filename = `${appName}.${useFileHash ? `[contenthash].` : ''}js`;

  let sharedDeps = {
    ...createSharedDeps(chromeProvided, dependencies, []),
    ...createSharedDeps(defaultShared, dependencies, exclude),
  };
  sharedDeps = applyImpliedDeps(sharedDeps, include, dependencies, impliedDeps);
  sharedDeps = mergeSharedDeps(sharedDeps, shared, chromeProvided);

  if (debug) {
    console.log('Using package at path: ', resolve(root, './package.json'));
    console.log('Using appName: ', appName);
    console.log(`Using ${exposes ? 'custom' : 'default'} exposes`);
    console.log('Number of custom shared modules is: ', shared.length);
    console.log('Number of merged shared modules is: ', Object.keys(sharedDeps).length);
    if (exclude.length > 0) {
      console.log('Excluding default packages', exclude);
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
