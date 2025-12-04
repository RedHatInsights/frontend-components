import { LogType, fecLogger, hasFEOFeaturesEnabled, readFrontendCRD, FrontendCRD } from '@redhat-cloud-services/frontend-components-config-utilities';
import path from 'path';
import createConfig, { CreateConfigOptions } from './createConfig';
import createPlugins, { CreatePluginsOptions } from './createPlugins';
const { sync } = require('glob');
export * from './createConfig';
export * from './createPlugins';

type WebpackConfiguration = import('webpack').Configuration;
export type FecWebpackConfiguration = WebpackConfiguration;

const getAppEntry = (rootFolder: string, isProd?: boolean) => {
  // Use entry-dev if it exists
  if (!isProd) {
    const entries = sync('src/entry-dev.{js,jsx,ts,tsx}', { cwd: rootFolder });
    if (entries.length > 1) {
      fecLogger(LogType.warn, `Found multiple entry-dev files. Using: ${entries[0]}`);
    }

    if (entries.length > 0) {
      return `${rootFolder}/${entries[0]}`;
    }
  }

  const entries = sync('src/entry.{js,jsx,ts,tsx}', { cwd: rootFolder });
  if (entries.length > 1) {
    fecLogger(LogType.warn, `Found multiple entry files. Using: ${entries[0]}`);
  }

  return `${rootFolder}/${entries[0]}`;
};

type FecConfigurationOptions = Omit<CreateConfigOptions, 'publicPath' | 'appEntry' | 'appName' | 'cdnPath'> &
  Omit<CreatePluginsOptions, 'cdnPath'> & {
    deployment?: string;
    debug?: boolean;
    appEntry?: string;
    blockLegacyChrome?: boolean;
    publicPath?: 'auto';
  };

const createFecConfig = (
  configurations: FecConfigurationOptions
): {
  config: ReturnType<typeof createConfig>;
  plugins: ReturnType<typeof createPlugins>;
} => {
  configurations.isProd = configurations.isProd || process.env.NODE_ENV === 'production';
  const isProd = configurations.isProd;
  const { insights } = require(`${configurations.rootFolder}/package.json`);
  let gitBranch;
  try {
    gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH;
  } catch (error) {
    fecLogger(LogType.info, 'no git branch detected, using main for webpack "main" config.');
    gitBranch = 'main';
  }
  const appDeployment = typeof configurations.deployment === 'string' ? configurations.deployment : configurations.deployment || 'apps';
  const { frontendCRDPath = path.resolve(configurations.rootFolder, 'deploy/frontend.yaml') } = configurations;

  const frontendCrdRef: { current?: FrontendCRD } = { current: undefined };
  let FEOFeaturesEnabled = false;
  try {
    frontendCrdRef.current = readFrontendCRD(frontendCRDPath);
    FEOFeaturesEnabled = hasFEOFeaturesEnabled(frontendCrdRef.current);
  } catch (e) {
    fecLogger(
      LogType.warn,
      `FEO features are not enabled. Unable to find frontend CRD file at ${frontendCRDPath}. If you want FEO features for local development, make sure to have a "deploy/frontend.yaml" file in your project or specify its location via "frontendCRDPath" attribute.`
    );
  }
  let cdnPath: string;
  // Could be written on a single line, but this is nice and readable
  if (FEOFeaturesEnabled && configurations.publicPath === 'auto' && frontendCrdRef.current) {
    // All service should eventually use this path
    cdnPath = `${frontendCrdRef.current?.objects[0]?.spec.frontend.paths[0]}/`.replace(/\/\//, '/');
  } else {
    cdnPath = `/${appDeployment}/${insights.appname}/`;
  }
  const appEntry = configurations.appEntry || getAppEntry(configurations.rootFolder, isProd);
  const generateSourceMaps = !isProd;

  if (configurations.debug) {
    console.group();
    fecLogger(LogType.debug, '~~~Using variables~~~');
    fecLogger(LogType.debug, `Root folder: ${configurations.rootFolder}`);
    fecLogger(LogType.debug, `Current branch: ${gitBranch}`);
    !generateSourceMaps && fecLogger(LogType.debug, `Source map generation for "${gitBranch}" deployment has been disabled.`);
    fecLogger(LogType.debug, `Using deployments: ${appDeployment}`);
    fecLogger(LogType.debug, `CDN path: ${cdnPath}`);
    fecLogger(LogType.debug, `App entry: ${appEntry}`);
    if (!process.env.FEC_DEV_PROXY) {
      fecLogger(LogType.debug, `Use proxy: ${configurations.useProxy ? 'true' : 'false'}`);
      if (!(configurations.useProxy || configurations.standalone)) {
        fecLogger(LogType.warn, 'Insights-proxy is deprecated in favor of "useProxy" or "standalone".');
        fecLogger(LogType.warn, 'See https://github.com/RedHatInsights/frontend-components/blob/master/packages/config/README.md');
      }
    }

    console.groupEnd();
    /* eslint-enable no-console */
  }

  return {
    config: createConfig({
      ...configurations,
      cdnPath,
      publicPath: configurations.publicPath,
      appEntry,
      appName: insights.appname,
      target: process.env.EPHEMERAL_TARGET ?? ''
    }),
    plugins: createPlugins({
      ...configurations,
      generateSourceMaps,
      appName: insights.appname,
    }),
  };
};

export default createFecConfig;
module.exports = createFecConfig;
