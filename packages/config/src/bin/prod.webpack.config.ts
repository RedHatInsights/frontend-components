const { fecLogger, LogType } = require('@redhat-cloud-services/frontend-components-config-utilities');
import FECConfiguration from '../lib/fec.config';
import config from '../lib/index';
import commonPlugins from './webpack.plugins';
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
  try {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

    if (BundleAnalyzerPlugin && env && env.analyze === 'true') {
      fecLogger(LogType.warn, `Webpack Bundle Analyzer support will be is deprecated and will be removed in the next major release.`);

      plugins.push(new BundleAnalyzerPlugin());
    }
  } catch {} // eslint-disable-line

  return {
    ...webpackConfig,
    plugins,
  };
};

export default start;
module.exports = start;
