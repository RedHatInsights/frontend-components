import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';
type ProxyConfigArrayItem = import('webpack-dev-server').ProxyConfigArrayItem;
import createConfig, { CreateConfigOptions } from './createConfig';
import createPlugins, { CreatePluginsOptions } from './createPlugins';
const { sync } = require('glob');
export * from './createConfig';
export * from './createPlugins';

type DevServerConfiguration = import('webpack-dev-server').Configuration;
type WebpackConfiguration = import('webpack').Configuration;
export interface FecWebpackConfiguration extends WebpackConfiguration {
  devServer?: DevServerConfiguration;
}

const gitRevisionPlugin = new (require('git-revision-webpack-plugin'))({
  branch: true,
});
const betaBranches = ['master', 'qa-beta', 'ci-beta', 'prod-beta', 'main', 'devel', 'stage-beta'];
const akamaiBranches = ['prod-beta', 'prod-stable'];

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

type FecConfigurationOptions = Omit<CreateConfigOptions, 'publicPath' | 'appEntry' | 'appName'> &
  CreatePluginsOptions & {
    deployment?: string;
    debug?: boolean;
    appEntry?: string;
  };

const createFecConfig = (
  configurations: FecConfigurationOptions
): {
  config: ReturnType<typeof createConfig>;
  plugins: ReturnType<typeof createPlugins>;
} => {
  if (configurations.debug) {
    fecLogger(LogType.info, 'FEC configuration: ', JSON.stringify(configurations || {}, null, 2));
  }

  configurations.isProd = configurations.isProd || process.env.NODE_ENV === 'production';
  const isProd = configurations.isProd;
  const { insights } = require(`${configurations.rootFolder}/package.json`);
  let gitBranch;
  try {
    gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
  } catch (error) {
    fecLogger(LogType.info, 'no git branch detected, using main for webpack "main" config.');
    gitBranch = 'main';
  }
  const appDeployment =
    typeof configurations.deployment === 'string'
      ? configurations.deployment
      : configurations.deployment || ((isProd && betaBranches.includes(gitBranch)) || process.env.BETA === 'true' ? 'beta/apps' : 'apps');

  const publicPath = `/${appDeployment}/${insights.appname}/`;
  const appEntry = configurations.appEntry || getAppEntry(configurations.rootFolder, isProd);
  const generateSourceMaps = !akamaiBranches.includes(gitBranch);

  console.group();
  fecLogger(LogType.info, `Root folder: ${configurations.rootFolder}`);
  fecLogger(LogType.info, `Current branch: ${gitBranch}`);
  !generateSourceMaps && fecLogger(LogType.info, `Source map generation for "${gitBranch}" deployment has been disabled.`);
  fecLogger(LogType.info, `Using deployments: ${appDeployment}`);
  fecLogger(LogType.info, `Public path: ${publicPath}`);
  fecLogger(LogType.info, `App entry: ${appEntry}`);
  fecLogger(LogType.info, `Proxy Mode enabled: ${configurations.useProxy ? 'true' : 'false'}`);
  fecLogger(LogType.info, `NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

  if (!(configurations.useProxy || configurations.standalone)) {
    fecLogger(LogType.warn, 'Insights-proxy is deprecated in favor of "useProxy" or "standalone".');
    fecLogger(LogType.warn, 'See https://github.com/RedHatInsights/frontend-components/blob/master/packages/config/README.md');
  }
  console.groupEnd();

  const fullWebPackConfig = {
    config: createConfig({
      ...configurations,
      publicPath,
      appEntry,
      appName: insights.appname,
    }),
    plugins: createPlugins({
      ...configurations,
      generateSourceMaps,
      appName: insights.appname,
    }),
  };

  if (configurations.debug) {
    fecLogger(LogType.info, 'Full webpack configuration: ', JSON.stringify(fullWebPackConfig, null, 2));
  }

  return fullWebPackConfig;
};

export default createFecConfig;
module.exports = createFecConfig;
