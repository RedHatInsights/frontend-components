const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./webpack.plugins');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const fecConfig = require(process.env.FEC_CONFIG_PATH);

const { config: webpackConfig, plugins } = config({
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
  ...(process.env.BETA === 'true' && { deployment: 'beta/apps' }),
});

const { plugins: externalPlugins } = fecConfig;
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
