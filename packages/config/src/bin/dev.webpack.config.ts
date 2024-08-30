import { ProxyConfigArrayItem } from 'webpack-dev-server';
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

const { plugins: externalPlugins = [], interceptChromeConfig, routes, ...externalConfig } = fecConfig;

const internalProxyRoutes: { [endpoint: string]: ProxyConfigArrayItem } = {
  ...routes,
  // '/apps/chrome': {
  //   target: `http://${process.env.FEC_CHROME_HOST}:${process.env.FEC_CHROME_PORT}`,
  // },
  ...(interceptChromeConfig === true
    ? {
        '/api/chrome-service/v1/static': {
          target: 'http://localhost:9999',
        },
      }
    : {}),
};

const { config: webpackConfig, plugins } = config({
  ...externalConfig,
  // do not hash files in dev env
  useFileHash: false,
  // enable webpack cache by default in dev env
  useCache: true,
  routes: internalProxyRoutes,
  ...(fecConfig.appUrl ? { appUrl: createAppUrl(fecConfig.appUrl) } : {}),
  deployment: 'apps',
  env: `${process.env.CLOUDOT_ENV}-stable` as FrontendEnv,
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
  blockLegacyChrome: true,
  hotReload: process.env.HOT_RELOAD === 'true',
  debug: process.env.DEBUG === 'true',
  skipProxyCheck: process.env.SKIP_PROXY_CHECK === 'true',
  useProxy: process.env.USE_PROXY === 'true',
  ...externalConfig,
  ...(process.env.PORT ? { port: parseInt(process.env.PORT) } : {}),
  ...(process.env.LOCAL_APPS ? { localApps: process.env.LOCAL_APPS } : {}),
  ...(process.env.LOCAL_APIS ? { localApis: process.env.LOCAL_APIS } : {}),
  ...(process.env.LOCAL_APP_HOST ? { localAppHost: process.env.LOCAL_APP_HOST } : {}),
  ...(process.env.OUTPUT_CONFIGS ? { outputConfigs: process.env.OUTPUT_CONFIGS === 'true' } : {}),
  ...(process.env.PROXY_VERBOSE ? { proxyVerbose: process.env.PROXY_VERBOSE === 'true' } : {}),
});

plugins.push(...commonPlugins, ...externalPlugins);

const devConfig: Configuration = {
  ...webpackConfig,
  plugins,
};

module.exports = devConfig;
export default devConfig;
