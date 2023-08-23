import FECConfiguration from '../lib/fec.config';
import config from '../lib/index';
import commonPlugins from './webpack.plugins';
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const fecConfig: FECConfiguration = require(process.env.FEC_CONFIG_PATH!);

type Configuration = import('webpack').Configuration;

const { plugins: externalPlugins = [], interceptChromeConfig, routes, hotReload, appUrl, ...externalConfig } = fecConfig;
const { config: webpackConfig, plugins } = config({
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
  ...externalConfig,
  ...(process.env.BETA === 'true' && { deployment: 'beta/apps' }),
  /** Do not use HMR for production builds */
  hotReload: false,
});

plugins.push(...commonPlugins, ...externalPlugins);

const start = (env: { analyze?: string }): Configuration => {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins,
  };
};

export default start;
module.exports = start;
