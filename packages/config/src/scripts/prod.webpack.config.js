const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./webpack.plugins');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const fecConfig = require(process.env.FEC_CONFIG_PATH);

const { plugins: externalPlugins, interceptChromeConfig, routes, ...externalConfig } = fecConfig;
const { config: webpackConfig, plugins } = config({
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
  ...externalConfig,
  ...(process.env.BETA === 'true' && { deployment: 'beta/apps' }),
});

plugins.push(...commonPlugins, ...externalPlugins);

module.exports = (env) => {
  if (env && env.analyze === 'true') {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return {
    ...webpackConfig,
    plugins,
  };
};
