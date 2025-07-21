import config, { FrontendEnv } from '../lib';
import FECConfiguration from '../lib/fec.config';
import commonPlugins from './webpack.plugins';
const fecConfig: FECConfiguration = require(process.env.FEC_CONFIG_PATH!);

type Configuration = import('webpack').Configuration;

function parseRegexpURL(url: RegExp) {
  return [new RegExp(url.toString())];
}

function createAppUrl(appUrl: string | string[] | (string | RegExp)[]) {
  if (Array.isArray(appUrl)) {
    return appUrl
      .map((url) => {
        if (url instanceof RegExp) {
          return parseRegexpURL(url);
        } else if (typeof url === 'string') {
          return url;
        } else {
          throw `Invalid appURL format! Expected string or regexp, got ${typeof url}. Check your fec.config.js:appUrl.`;
        }
      })
      .flat();
  } else if (typeof appUrl === 'object') {
    return parseRegexpURL(appUrl);
  } else if (typeof appUrl === 'string') {
    return [appUrl];
  } else {
    throw `Invalid appURL format! Expected string or regexp, got ${typeof appUrl}. Check your fec.config.js:appUrl.`;
  }
}

const appUrl = createAppUrl(fecConfig.appUrl);

const { plugins: externalPlugins = [], ...externalConfig } = fecConfig;

const { config: webpackConfig, plugins } = config({
  useFileHash: false,
  useCache: true,
  ...externalConfig,
  appUrl,
  deployment: 'apps',
  env: `${process.env.CLOUDOT_ENV}-stable` as FrontendEnv,
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
  blockLegacyChrome: true,
});
plugins.push(...commonPlugins, ...externalPlugins);

const devConfig: Configuration = {
  ...webpackConfig,
  plugins,
};

if (devConfig.devServer) {
  delete devConfig.devServer;
}

module.exports = devConfig;
export default devConfig;
