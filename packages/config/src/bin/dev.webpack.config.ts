import { ProxyConfigArrayItem } from 'webpack-dev-server';
import config, { FrontendEnv } from '../lib';
import FECConfiguration from '../lib/fec.config';
import commonPlugins from './webpack.plugins';
const fecConfig: FECConfiguration = require(process.env.FEC_CONFIG_PATH!);

type Configuration = import('webpack').Configuration;

const isBeta = process.env.BETA === 'true';

function parseRegexpURL(url: RegExp) {
  return isBeta ? [new RegExp(`/beta${url.toString()}`), new RegExp(`/preview${url.toString()}`)] : [new RegExp(url.toString())];
}

function createAppUrl(appUrl: string | string[] | (string | RegExp)[]) {
  if (Array.isArray(appUrl)) {
    return appUrl
      .map((url) => {
        if (url instanceof RegExp) {
          return parseRegexpURL(url);
        } else if (typeof url === 'string') {
          return isBeta ? [`/beta${url}`, `/preview${url}`] : url;
        } else {
          throw `Invalid appURL format! Expected string or regexp, got ${typeof url}. Check your fec.config.js:appUrl.`;
        }
      })
      .flat();
  } else if (typeof appUrl === 'object') {
    return parseRegexpURL(appUrl);
  } else if (typeof appUrl === 'string') {
    return [`${isBeta ? '/beta' : ''}${appUrl}`];
  } else {
    throw `Invalid appURL format! Expected string or regexp, got ${typeof appUrl}. Check your fec.config.js:appUrl.`;
  }
}

const appUrl = createAppUrl(fecConfig.appUrl);

const { plugins: externalPlugins = [], interceptChromeConfig, routes, ...externalConfig } = fecConfig;

const internalProxyRoutes: { [endpoint: string]: ProxyConfigArrayItem } = {
  ...routes,
  ...(interceptChromeConfig === true
    ? {
        '/api/chrome-service/v1/static': {
          target: 'http://localhost:9999',
        },
      }
    : {}),
};

const { config: webpackConfig, plugins } = config({
  // do not hash files in dev env
  useFileHash: false,
  // enable webpack cache by default in dev env
  useCache: true,
  ...externalConfig,
  routes: internalProxyRoutes,
  appUrl,
  deployment: isBeta ? 'beta/apps' : 'apps',
  env: `${process.env.CLOUDOT_ENV}-${isBeta === true ? 'beta' : 'stable'}` as FrontendEnv,
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
});
plugins.push(...commonPlugins, ...externalPlugins);

const devConfig: Configuration = {
  ...webpackConfig,
  plugins,
};

module.exports = devConfig;
export default devConfig;
