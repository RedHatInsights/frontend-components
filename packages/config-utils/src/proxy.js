/* eslint-disable no-console */
// Webpack proxy and express config for `useProxy: true` or `standalone: true`
const { execSync } = require('child_process');
const fetch = require('node-fetch');
var express = require('express');
const path = require('path');
const HttpsProxyAgent = require('https-proxy-agent');
const cookieTransform = require('./cookieTransform');
const router = require('./standalone/helpers/router');
const { getConfig, isGitUrl, getExposedPort, resolvePath } = require('./standalone/helpers/index');
const { checkoutRepo } = require('./standalone/helpers/checkout');
const { startService, stopService } = require('./standalone/startService');
const { NET } = require('./standalone/helpers');
const defaultServices = require('./standalone/services/default');
const { registerChrome } = require('./standalone/services/default/chrome');

const defaultReposDir = path.join(__dirname, 'repos');

const checkLocalAppHost = (appName, hostUrl, port) => {
  const check = execSync(`curl --max-time 5 --silent --head ${hostUrl} | awk '/^HTTP/{print $2}'`).toString().trim();

  if (check !== '200') {
    console.error('\n' + appName[0].toUpperCase() + appName.substring(1) + ' is not running or available via ' + hostUrl);
    console.log(
      '\nMake sure to run `npm run start -- --port=' +
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

const buildRoutes = (routes, target) =>
  Object.entries(routes || {}).map(([route, redirect]) => {
    const currTarget = redirect.host || redirect;
    delete redirect.host;
    return {
      context: (path) => path.includes(route),
      target: currTarget === 'PORTAL_BACKEND_MARKER' ? target : currTarget,
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      ws: true,
      onProxyReq: cookieTransform,
      ...(currTarget === 'PORTAL_BACKEND_MARKER' && { router }),
      ...(typeof redirect === 'object' ? redirect : {}),
    };
  });

const buildLocalAppRoutes = (localApps, defaultLocalAppHost, target) =>
  buildRoutes(
    (!Array.isArray(localApps) ? localApps.split(',') : localApps).reduce((acc, curr) => {
      const [appName, appConfig] = (curr || '').split(':');
      const [appPort = 8003, protocol = 'http'] = appConfig.split('~');
      const appUrl = `${protocol}://${defaultLocalAppHost}:${appPort}`;

      if (checkLocalAppHost(appName, appUrl, appPort)) {
        console.log('Creating app proxy routes for: ' + appName + ' to ' + appUrl);

        return {
          ...acc,
          [`/apps/${appName}`]: {
            host: appUrl,
          },
          [`/preview/apps/${appName}`]: {
            host: appUrl,
          },
        };
      } else {
        process.exit();
      }
    }, {}),
    target
  );

module.exports = ({
  env = 'ci-beta',
  customProxy = [],
  routes,
  routesPath,
  useProxy,
  proxyURL = 'http://squid.corp.redhat.com:3128',
  standalone,
  port,
  reposDir = defaultReposDir,
  localChrome,
  appUrl = [],
  publicPath,
  proxyVerbose,
  useCloud = false,
  target = '',
  keycloakUri = '',
  registry = [],
  isChrome = false,
  onBeforeSetupMiddleware = () => {},
  bounceProd = false,
  useAgent = true,
  useDevBuild = true,
  localApps = process.env.LOCAL_APPS,
}) => {
  const proxy = [];
  const majorEnv = env.split('-')[0];
  const defaultLocalAppHost = process.env.LOCAL_APP_HOST || majorEnv + '.foo.redhat.com';

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
    agent = new HttpsProxyAgent(proxyURL);
  }

  if (isStage) {
    // stage-stable / stage-beta branches don't exist in build repos
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

  if (localApps?.length > 0) {
    proxy.push(...buildLocalAppRoutes(localApps, defaultLocalAppHost, target));
  }

  if (customProxy) {
    proxy.push(...customProxy);
  }

  let standaloneConfig;
  if (standalone) {
    standaloneConfig = getConfig(standalone, localChrome, env, port);
    // Create network for services.
    execSync(`docker network inspect ${NET} >/dev/null 2>&1 || docker network create ${NET}`);

    // Clone repos and resolve functions
    // If we manage the repos it's okay to overwrite the contents
    const overwrite = reposDir === defaultReposDir;

    // Resolve config functions for cross-service references
    for (const [, proj] of Object.entries(standaloneConfig)) {
      const { services, path, assets, register } = proj;
      if (typeof register === 'function') {
        registry.push(register);
      }

      if (isGitUrl(path)) {
        // Add typical branch if not included
        if (!path.includes('#')) {
          proj.path = `${path}#${env}`;
        }

        proj.path = checkoutRepo({ repo: proj.path, reposDir, overwrite });
      }

      Object.keys(assets || []).forEach((key) => {
        if (isGitUrl(assets[key])) {
          assets[key] = checkoutRepo({ repo: assets[key], reposDir, overwrite });
        }
      });

      // Resolve functions that depend on env, port, or assets
      if (typeof services === 'function') {
        proj.services = services({ env, port, assets });
      }
    }

    // Start standalone services.
    for (const [projName, proj] of Object.entries(standaloneConfig)) {
      const { services, path, assets, onProxyReq, keycloakUri, register, target, ...rest } = proj;
      const serviceNames = [];
      for (let [subServiceName, subService] of Object.entries(proj.services || {})) {
        const name = [projName, subServiceName].join('_');
        startService(standaloneConfig, name, subService);
        serviceNames.push(name);
        const port = getExposedPort(subService.args);
        console.log('Container', name, 'listening', port ? 'on' : '', port || '');
      }

      process.on('SIGINT', () => serviceNames.forEach(stopService));

      if (target) {
        proxy.push({
          secure: false,
          changeOrigin: true,
          onProxyReq: cookieTransform,
          target,
          ...rest,
        });
      }
    }

    process.on('SIGINT', () => process.exit());
  }

  if (useProxy) {
    // Catch-all
    proxy.push({
      secure: false,
      changeOrigin: true,
      autoRewrite: true,
      context: (url) => {
        const shouldProxy = !appUrl.find((u) => (typeof u === 'string' ? url.startsWith(u) : u.test(url)));
        if (shouldProxy) {
          if (proxyVerbose) {
            console.log('proxy', url);
          }

          return true;
        }

        return false;
      },
      target,
      bypass: async (req, res) => {
        /**
         * Bypass any HTML requests if using chrome
         * Serves as a historyApiFallback when refreshing on any other URL than '/'
         */
        if (isChrome && !req.url.match(/\/api\//) && !req.url.match(/\./) && req.headers.accept.includes('text/html')) {
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
            headers: { cookie: req.headers.cookie, 'Content-Type': 'application/json' },
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

  return {
    ...(proxy.length > 0 && { proxy }),
    onListening(server) {
      if (useProxy || standaloneConfig) {
        const host = useProxy ? `${majorEnv}.foo.redhat.com` : 'localhost';
        const origin = `http${server.options.https ? 's' : ''}://${host}:${server.options.port}`;
        console.log('App should run on:');

        console.log('\u001b[34m'); // Use same webpack-dev-server blue
        if (appUrl.length > 0) {
          appUrl.slice(0, appUrl.length - 1).forEach((url) => console.log(`  - ${origin}${url}`));

          console.log('\x1b[0m');
          console.log('Static assets are available at:');
          console.log('\u001b[34m'); // Use same webpack-dev-server blue
          console.log(`  - ${origin}${appUrl[appUrl.length - 1]}`);
        } else {
          console.log(`  - ${origin}`);
        }

        console.log('\u001b[0m');
      }
    },
    onBeforeSetupMiddleware({ app, compiler, options }) {
      app.enable('strict routing'); // trailing slashes are mean

      if (shouldBounceProdRequests) {
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
      }

      /**
       * Allow serving chrome assets
       * This will allow running chrome as a host application
       */
      if (!isChrome) {
        let chromePath = localChrome;
        if (standaloneConfig) {
          if (standaloneConfig.chrome) {
            chromePath = resolvePath(reposDir, standaloneConfig.chrome.path);
            keycloakUri = standaloneConfig.chrome.keycloakUri;
          }
        } else if (!localChrome && useProxy) {
          if (typeof defaultServices.chrome === 'function') {
            defaultServices.chrome = defaultServices.chrome({});
          }

          const chromeEnv = useDevBuild ? (env.includes('-beta') ? 'dev-beta' : 'dev-stable') : env;
          chromePath = checkoutRepo({
            repo: `${defaultServices.chrome.path}#${chromeEnv}`,
            reposDir,
            overwrite: true,
          });
        }

        onBeforeSetupMiddleware({ chromePath });

        if (chromePath) {
          registerChrome({
            app,
            chromePath,
            keycloakUri,
            https: Boolean(options.https),
            proxyVerbose,
          });
        }
      }

      registry.forEach((cb) =>
        cb({
          app,
          options,
          compiler,
          config: standaloneConfig,
        })
      );
    },
  };
};
