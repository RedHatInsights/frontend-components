import FECConfiguration from '../lib/fec.config';
import config from '../lib/index';
import commonPlugins from './rspack.plugins';
const fecConfig: FECConfiguration = require(process.env.FEC_CONFIG_PATH!);

type Configuration = import('@rspack/core').Configuration;

const { plugins: externalPlugins = [], interceptChromeConfig, routes, hotReload, appUrl, ...externalConfig } = fecConfig;
const { config: rspackConfig, plugins } = config({
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
  ...externalConfig,
  /** Do not use HMR for production builds */
  hotReload: false,
});

plugins.push(...commonPlugins, ...externalPlugins);

const start = (): Configuration => {
  return {
    ...rspackConfig,
    plugins,
  };
};

export default start;
module.exports = start;
