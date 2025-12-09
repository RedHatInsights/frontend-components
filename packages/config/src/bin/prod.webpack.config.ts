import fecLogger, { LogType } from '@redhat-cloud-services/frontend-components-config-utilities/fec-logger';
import path from 'path';
import { hasFEOFeaturesEnabled, readFrontendCRD, validateFrontendCrd } from '@redhat-cloud-services/frontend-components-config-utilities/feo';
import FECConfiguration from '../lib/fec.config';
import config from '../lib/index';
import commonPlugins from './webpack.plugins';
const fecConfig: FECConfiguration = require(process.env.FEC_CONFIG_PATH!);

type Configuration = import('webpack').Configuration;

const rootFolder = process.env.FEC_ROOT_DIR || process.cwd();
const {
  plugins: externalPlugins = [],
  interceptChromeConfig,
  routes,
  hotReload,
  appUrl,
  frontendCRDPath = path.resolve(rootFolder, 'deploy/frontend.yaml'),
  ...externalConfig
} = fecConfig;
const { config: webpackConfig, plugins } = config({
  rootFolder,
  ...externalConfig,
  /** Do not use HMR for production builds */
  hotReload: false,
  /** Do configure/inti webpack dev server */
  deploymentBuild: true,
});

const frontendCrd = readFrontendCRD(frontendCRDPath);
const feoEnabled = hasFEOFeaturesEnabled(frontendCrd);
if (feoEnabled) {
  validateFrontendCrd(frontendCrd);
}

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
