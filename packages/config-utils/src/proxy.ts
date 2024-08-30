/* eslint-disable no-console */
// Webpack proxy and express config for `useProxy: true` or `standalone: true`
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import chalk from 'chalk';
import type { Configuration } from 'webpack-dev-server';
import { HttpsProxyAgent } from 'https-proxy-agent';
import cookieTransform from './cookieTransform';
import router from './standalone/helpers/router';
import fecLogger, { LogType } from './fec-logger';

const hasCurlInstalled = () => execSync('which curl | echo $?').toString().trim() === '0';

const checkLocalAppHost = (appName: string, hostUrl: string, port: number | string) => {
  const check = execSync(`curl --max-time 5 --silent --head ${hostUrl} | awk '/^HTTP/{print $2}'`).toString().trim();

  if (check !== '200') {
    fecLogger(LogType.error, appName[0].toUpperCase() + appName.substring(1) + ' is not running or available via ' + hostUrl);
    fecLogger(
      LogType.info,
      '\nIf it is another frontend application, make sure to run `npm run start -- --port=' +
        port +
        '` in the ' +
        appName +
        " application directory to start it's webpack dev server and the bundle is built.\n"
    );

    return false;
  } else {
    return true;
  }
};

type ProxyConfigItem = import('webpack-dev-server').ProxyConfigArrayItem;

const buildRoutes = (
  routes: {
    [route: string]: ProxyConfigItem & { host?: string };
  },
  target: string
) =>
  Object.entries(routes || {}).map(([route, redirect]) => {
    const currTarget = typeof redirect === 'object' ? redirect.host : redirect;
    if (typeof redirect === 'object') {
      delete redirect.host;
    }
    const result: ProxyConfigItem = {
      context: (path: string) => path.includes(route),
      target: currTarget === 'PORTAL_BACKEND_MARKER' ? target : currTarget || undefined,
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
      onProxyReq: cookieTransform as ProxyConfigItem['onProxyReq'],
      ...(currTarget === 'PORTAL_BACKEND_MARKER' && { router: router(target, false) }),
      ...(typeof redirect === 'object' ? redirect : {}),
    };

    return result;
  });

const buildLocalAppRoutes = (
  localApps: string | string[],
  defaultLocalAppHost: string,
  target: string,
  pathPrefix: string,
  skipProxyCheck: boolean
) =>
  buildRoutes(
    (!Array.isArray(localApps) ? localApps.split(',') : localApps).reduce((acc, curr) => {
      const [appName, appConfig] = (curr || '').split(':');
      const [appPort = 8003, protocol = 'http'] = appConfig.split('~');
      const appUrl = `${protocol}://${defaultLocalAppHost}:${appPort}`;
      const appPath = `${pathPrefix}/${appName}`;

      if (!skipProxyCheck && hasCurlInstalled()) {
        if (!checkLocalAppHost(appName, appUrl, appPort)) {
          process.exit();
        }
      }

      fecLogger(LogType.info, 'Creating proxy route for: ' + appPath + ' to ' + appUrl);

      return {
        ...acc,
        [appPath]: {
          host: appUrl,
        },
      };
    }, {}),
    target
  );

export type ProxyOptions = {
  env?: 'prod-stable' | 'stage-stable' | string;
  customProxy?: ProxyConfigItem[];
  routes?: { routes?: { [route: string]: ProxyConfigItem } } & { [route: string]: ProxyConfigItem };
  routesPath?: string;
  useProxy?: boolean;
  proxyURL?: string;
  standalone?: boolean;
  port?: number;
  reposDir?: string;
  localChrome?: string;
  appUrl?: string;
  publicPath: string;
  proxyVerbose?: boolean;
  useCloud?: boolean;
  target?: string;
  keycloakUri?: string;
  registry?: ((...args: any[]) => void)[];
  isChrome?: boolean;
  onBeforeSetupMiddleware?: (opts: { chromePath?: string }) => void;
  bounceProd?: boolean;
  useAgent?: boolean;
  useDevBuild?: boolean;
  localApps?: string;
  /**
   * Used to block running chrome from build repos.
   * Chrome should be running from container from now on.
   */
  blockLegacyChrome?: boolean;
  localApis?: string;
  skipProxyCheck?: boolean;
  localAppHost?: string;
};

const proxy = ({
  env = 'stage-stable',
  customProxy = [],
  routes,
  routesPath,
  useProxy,
  // TODO It should be possible to set this as well from the outside.
  proxyURL = 'http://squid.corp.redhat.com:3128',
  appUrl,
  publicPath,
  // proxyVerbose,
  useCloud = false,
  target = '',
  isChrome = false,
  bounceProd = false,
  useAgent = true,
  localApps,
  localApis,
  skipProxyCheck = false,
  localAppHost,
}: ProxyOptions) => {
  const proxy: ProxyConfigItem[] = [];
  const majorEnv = env.split('-')[0];
  const defaultLocalAppHost = localAppHost || majorEnv + '.foo.redhat.com';

  if (target === '') {
    target += 'https://';
    if (!['prod', 'stage'].includes(majorEnv)) {
      target += majorEnv + '.';
    }

    target += useCloud ? 'cloud' : 'console';
    if (majorEnv === 'stage') {
      target += '.stage';
    }

    target += '.redhat.com/';
  }

  let agent;

  const isProd = env.startsWith('prod');
  const isStage = env.startsWith('stage');

  const shouldBounceProdRequests = isProd && bounceProd && !useAgent;

  if (isStage || (isProd && useAgent)) {
    // stage is deployed with Akamai which requires a corporate proxy
    console.log('CONFIGURE AGENt');
    agent = new HttpsProxyAgent(proxyURL);
  }

  if (isStage) {
    // stage-stable branches don't exist in build repos
    // Currently stage pulls from QA
    env = env.replace('stage', 'qa');
  }

  if (!Array.isArray(appUrl)) {
    appUrl = [appUrl];
  }

  appUrl.push(publicPath);

  if (routesPath) {
    routes = require(routesPath);
  }

  if (routes) {
    routes = routes.routes || routes;
    proxy.push(...buildRoutes(routes, target));
  }

  if (localApps && localApps.length > 0) {
    proxy.push(...buildLocalAppRoutes(localApps, defaultLocalAppHost, target, '/apps', skipProxyCheck));
  }

  if (localApis && localApis.length > 0) {
    proxy.push(...buildLocalAppRoutes(localApis, defaultLocalAppHost, target, '/api', skipProxyCheck));
  }

  if (customProxy) {
    proxy.push(...customProxy);
  }

  if (useProxy) {
    // Catch-all
    console.log('AAADDDDDING proxy');
    proxy.push({
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      context: (url: string) => {
        const shouldProxy = !url.startsWith(appUrl);
        if (shouldProxy) {
          fecLogger(LogType.info, 'proxy' + url);
          return true;
        } else {
          fecLogger(LogType.info, 'not proxy' + url);
          return false;
        }
      },
      target,
      bypass: async (req, res) => {
        /**
         * Bypass any HTML requests if using chrome
         * Serves as a historyApiFallback when refreshing on any other URL than '/'
         */
        if (isChrome && !req.url.match(/\/api\//) && !req.url.match(/\./) && req.headers.accept?.includes('text/html')) {
          return '/';
        }

        /**
         * Use node-fetch to proxy all non-GET requests (this avoids all origin/host akamai policy)
         * This enables using PROD proxy without VPN and agent
         */
        if (shouldBounceProdRequests && req.method !== 'GET') {
          const result = await fetch((target + req.url).replace(/\/\//g, '/'), {
            method: req.method,
            body: JSON.stringify(req.body),
            headers: {
              ...(req.headers.cookie && {
                cookie: req.headers.cookie,
              }),
              'Content-Type': 'application/json',
            },
          });

          const text = await result.text();
          try {
            const data = JSON.parse(text);
            res.status(result.status).json(data);
          } catch (err) {
            res.status(result.status).send(text);
          }
        }

        return null;
      },
      router: router(target, useCloud),
      ...(agent && {
        agent,
        headers: {
          // Staging Akamai CORS gives 403s for non-GET requests from non-origin hosts
          Host: target.replace('https://', ''),
          Origin: target,
        },
      }),
    });
  }

  const config: Configuration = {
    ...(proxy.length > 0 && { proxy }),
    onListening(server) {
      if (useProxy) {
        // TODO Refactor to use the hostname provided from a config/option higher up.
        const host = useProxy ? `${majorEnv}.foo.redhat.com` : 'localhost';
        const origin = `http${server.options.https ? 's' : ''}://${host}:${server.options.port}`;
        fecLogger(LogType.info, '');
        fecLogger(LogType.info, chalk.bold('App should run on:'));
        fecLogger(LogType.info, '');
        (typeof appUrl === 'string' ? [appUrl] : appUrl).forEach((url) => fecLogger(LogType.info, `  - ${origin}${url}`));
        fecLogger(LogType.info, '');
      }
    },
  };

  return config;
};

export default proxy;
module.exports = proxy;
