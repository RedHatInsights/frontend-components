const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./webpack.plugins.js');

const isBeta = process.env.BETA === 'true';

const { config: webpackConfig, plugins } = config({
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
  debug: true,
  deployment: isBeta ? 'beta/apps' : 'apps',
  useProxy: true,
  appUrl: isBeta ? '/beta/staging/starter' : '/staging/starter',
  env: `${process.env.CLOUDOT_ENV}-${isBeta === 'true' ? 'beta' : 'stable'}`,
  routesPath: process.env.ROUTES_PATH,
});
plugins.push(...commonPlugins);

module.exports = {
  ...webpackConfig,
  plugins,
};
