const config = require('@redhat-cloud-services/frontend-components-config');
const commonPlugins = require('./webpack.plugins.js');
const fecConfig = require(process.env.FEC_CONFIG_PATH);

const isBeta = process.env.BETA === 'true';

function parseRegexpURL(url) {
  return new RegExp(`${isBeta ? '/beta' : ''}${url.toString()}`);
}

function createAppUrl(appUrl) {
  if (Array.isArray(appUrl)) {
    return appUrl.map((url) => {
      if (typeof url === 'object') {
        return parseRegexpURL(url);
      } else if (typeof url === 'string') {
        return `${isBeta ? '/beta' : ''}${url}`;
      } else {
        throw `Invalid appURL format! Expected string or regexp, got ${typeof url}. Check your fec.config.js:appUrl.`;
      }
    });
  } else if (typeof appUrl === 'object') {
    return parseRegexpURL(appUrl);
  } else if (typeof appUrl === 'string') {
    return `${isBeta ? '/beta' : ''}${appUrl}`;
  } else {
    throw `Invalid appURL format! Expected string or regexp, got ${typeof appUrl}. Check your fec.config.js:appUrl.`;
  }
}

const appUrl = createAppUrl(fecConfig.appUrl);

const { plugins: externalPlugins, interceptChromeConfig, routes, ...externalConfig } = fecConfig;

const internalProxyRoutes = {
  ...routes,
  ...(interceptChromeConfig === true
    ? {
        '/beta/config': {
          host: 'http://localhost:9999',
        },
        '/config': {
          host: 'http://localhost:9999',
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
  env: `${process.env.CLOUDOT_ENV}-${isBeta === true ? 'beta' : 'stable'}`,
  rootFolder: process.env.FEC_ROOT_DIR || process.cwd(),
});
plugins.push(...commonPlugins, ...externalPlugins);

module.exports = {
  ...webpackConfig,
  plugins,
};
