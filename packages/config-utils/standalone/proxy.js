/* eslint-disable no-console */
// Webpack proxy config for `useProxy: true` or `standalone: true`
const { execSync } = require('child_process');
const cookieTransform = require('./helpers/cookieTransform');
const router = require('./helpers/router');
const { getConfig, isGitUrl, getExposedPort } = require('./helpers/index');
const { checkoutRepo } = require('./helpers/checkout');
const { startService } = require('./startService');
const { NET } = require('./helpers');

module.exports = async ({
    env,
    localChrome,
    customProxy = [],
    routes,
    routesPath,
    useProxy,
    standalone,
    port,
    reposDir
}) => {
    const proxy = [];
    const target = env === 'prod-stable'
        ? 'https://cloud.redhat.com/'
        : `https://${env.split('-')[0]}.cloud.redhat.com/`;

    if (routesPath) {
        routes = require(routesPath);
    }
    if (routes) {
        routes = routes.routes || routes;
        console.log('Making proxy from SPANDX routes');
        proxy.push(
            ...Object.entries(routes || {}).map(([route, redirect]) => {
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
                    ...typeof redirect === 'object' ? redirect : {}
                };
            })
        );
    }
    if (customProxy) {
        proxy.push(...customProxy);
    }
    if (standalone) {
        const projects = getConfig(standalone, env, port);
        // Create network for services.
        execSync(`docker network inspect ${NET} >/dev/null 2>&1 || docker network create ${NET}`);

        // Clone repos
        // If we manage the repos it's okay to overwrite the contents
        const overwrite = reposDir === 'repos';
        // Need to use for loop for `await`
        for (let [projName, proj] of Object.entries(projects)) {
            let { services, path, assets, onProxyReq, keycloakUri, ...rest } = proj;

            if (isGitUrl(path)) {
                // Add typical branch if not included
                if (!path.includes('#')) {
                    path = `${path}#${env}`;
                }
                path = checkoutRepo({ repo: path, reposDir, overwrite });
            }
            Object.keys(assets || []).forEach(key => {
                if (isGitUrl(assets[key])) {
                    assets[key] = checkoutRepo({ repo: assets[key], reposDir, overwrite });
                }
            });

            // Resolve functions that depend on env, port, or assets
            if (typeof services === 'function') {
                services = services({ env, port, assets });
            }
            // Start standalone services.
            // Need to use for loop for `await`
            for (let [subServiceName, subService] of Object.entries(services || {})) {
                const name = [projName, subServiceName].join('_');
                await startService(services, name, subService)
                const port = getExposedPort(subService.args);
                console.log("Container", name, "listening", port ? 'on' : '', port || '');
            }

            proxy.push({
                secure: false,
                changeOrigin: true,
                // https://github.com/chimurai/http-proxy-middleware#http-proxy-events
                onProxyReq(proxyReq, req, res) {
                   onProxyReq(proxyReq, req, res, config);
                   cookieTransform(proxyReq, req);
                },
                ...rest
            });
        }
    }
    if (useProxy) {
        // Catch-all
        proxy.push({
            context: () => true,
            target,
            secure: false,
            changeOrigin: true,
            autoRewrite: true,
            router: router(target)
        });
    }

    console.log('proxy', proxy);
    return proxy;
}

module.exports({
    env: 'ci-beta',
    useProxy: false,
    standalone: true,
    port: 1337,
    reposDir: 'repos'
}).then(() => console.log('done'))
