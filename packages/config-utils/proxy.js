/* eslint-disable no-console */
// Webpack proxy and express config for `useProxy: true` or `standalone: true`
const { execSync } = require('child_process');
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
    registry = []
}) => {
    const proxy = [];
    const majorEnv = env.split('-')[0];
    if (target === '') {
        target += 'https://';
        if (![ 'prod', 'stage' ].includes(majorEnv)) {
            target += majorEnv + '.';
        }

        target += useCloud ? 'cloud' : 'console';
        if (majorEnv === 'stage') {
            target += '.stage';
        }

        target += '.redhat.com/';
    }

    console.log('Proxing to', target);

    let agent;
    if (env.startsWith('stage')) {
        // stage-stable / stage-beta branches don't exist in build repos
        // Currently stage pulls from QA
        env = env.replace('stage', 'qa');
        // QA and stage are deployed with Akamai which requires a corporate proxy
        agent = new HttpsProxyAgent(proxyURL);
    }

    if (!Array.isArray(appUrl)) {
        appUrl = [ appUrl ];
    }

    appUrl.push(publicPath);

    if (routesPath) {
        routes = require(routesPath);
    }

    if (routes) {
        routes = routes.routes || routes;
        console.log('Making proxy from SPANDX routes');
        proxy.push(
            ...Object.entries(routes || {}).map(([ route, redirect ]) => {
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
                    ...typeof redirect === 'object' ? redirect : {},
                    ...(agent && { agent })
                };
            })
        );
    }

    if (customProxy) {
        proxy.push(...customProxy);
    }

    let standaloneConfig;
    if (standalone) {
        standaloneConfig = getConfig(standalone, localChrome, env, port);
        // Create network for services.
        execSync(`docker network inspect ${NET} >/dev/null 2>&1 || docker network create ${NET}`);

        // Clone repos
        // If we manage the repos it's okay to overwrite the contents
        const overwrite = reposDir === defaultReposDir;
        // Need to use for loop for `await`
        for (const [ projName, proj ] of Object.entries(standaloneConfig)) {
            const { services, path, assets, onProxyReq, keycloakUri, register, target, ...rest } = proj;
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

            Object.keys(assets || []).forEach(key => {
                if (isGitUrl(assets[key])) {
                    assets[key] = checkoutRepo({ repo: assets[key], reposDir, overwrite });
                }
            });

            // Resolve functions that depend on env, port, or assets
            if (typeof services === 'function') {
                proj.services = services({ env, port, assets });
            }

            // Start standalone services.
            const serviceNames = [];
            for (let [ subServiceName, subService ] of Object.entries(proj.services || {})) {
                const name = [ projName, subServiceName ].join('_');
                startService(standaloneConfig, name, subService);
                serviceNames.push(name);
                const port = getExposedPort(subService.args);
                console.log('Container', name, 'listening', port ? 'on' : '', port || '');
            }

            process.on('SIGINT', () => {
                console.log();
                serviceNames.forEach(stopService);
                process.exit();
            });

            if (target) {
                proxy.push({
                    secure: false,
                    changeOrigin: true,
                    onProxyReq: cookieTransform,
                    target,
                    ...rest
                });
            }
        }
    }

    if (useProxy) {
        // Catch-all
        proxy.push({
            secure: false,
            changeOrigin: true,
            autoRewrite: true,
            context: url => {
                const shouldProxy = !appUrl.find(u => typeof u === 'string' ? url.startsWith(u) : u.test(url));
                if (shouldProxy) {
                    console.log('proxy', url);
                    return true;
                }

                return false;
            },
            target,
            router: router(target, useCloud),
            ...(agent && { agent })
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
                    appUrl.forEach(url => console.log(`  - ${origin}${url}`));
                } else {
                    console.log(`  - ${origin}`);
                }

                console.log('\u001b[0m');
            }
        },
        before(app, server, compiler) {
            app.enable('strict routing'); // trailing slashes are mean
            let chromePath = localChrome;
            if (standaloneConfig) {
                chromePath = resolvePath(reposDir, standaloneConfig.chrome.path);
            } else if (!localChrome && useProxy) {
                if (typeof defaultServices.chrome === 'function') {
                    defaultServices.chrome = defaultServices.chrome({});
                }

                chromePath = checkoutRepo({
                    repo: `${defaultServices.chrome.path}#${env}`,
                    reposDir,
                    overwrite: true
                });
            }

            if (chromePath) {
                registerChrome({
                    app,
                    chromePath,
                    keycloakUri: (standaloneConfig && standaloneConfig.chrome) ? standaloneConfig.chrome.keycloakUri : null,
                    https: Boolean(server.options.https),
                    proxyVerbose
                });
            }

            registry.forEach(cb => cb({
                app,
                server,
                compiler,
                config: standaloneConfig
            }));
        }
    };
};

