/* eslint-disable no-console */
// Webpack proxy and express config for `useProxy: true` or `standalone: true`
const standaloneProxy = require('./standalone/proxy');
const { readFileSync } = require('fs');
const { sync } = require('glob');
const ESI = require('nodesi');
const cookieTransform = require('./cookieTransform');
const transformUrl = require('./router');

module.exports = (options) => {
    const {
        betaEnv = 'ci',
        customProxy = [],
        routes,
        routesPath,
        standalone,
        port = 1337,
        localChrome,
        appUrl = [],
        publicPath,
        proxyVerbose,
        rootFolder,
        useCloud = false,
        https = true,
        exactUrl,
        disableFallback
    } = options;

    if (standalone) {
        return standaloneProxy(options);
    }

    let appUrls = appUrl;
    if (appUrls && !Array.isArray(appUrls)) {
        appUrls = [ appUrls ];
    }

    let comparator = (path, url) => path.includes(url);
    if (exactUrl) {
        comparator = (path, url) => path === url;
    }

    // disable self signed CERT checks for esi
    if (appUrl) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    }

    const target = betaEnv === 'prod' ? `https://${useCloud ? 'cloud' : 'console'}.redhat.com/` : `https://${betaEnv}.${useCloud ? 'cloud' : 'console'}.redhat.com/`;

    let proxyRoutes = routes;

    if (routesPath) {
        proxyRoutes = require(routesPath);
    }

    if (proxyRoutes) {
        proxyRoutes = proxyRoutes.routes || proxyRoutes;
    }

    const esi = appUrl && new ESI({
        allowedHosts: [ /^https:\/\/.*cloud.redhat.com$/ ],
        baseUrl: `${https ? 'https' : 'http'}://${betaEnv}.foo.redhat.com:${port}`,
        cache: false,
        onError: (src, error) => {
            console.error(
                `An error occurred while resolving an ESI tag`
            );
            console.error(error);
        }
    });

    proxyVerbose && proxyRoutes && console.log(`Using proxy routes: ${JSON.stringify(proxyRoutes, null, 2)}`);

    const isNotCustomContext = (path) => {
        if (Object.keys(proxyRoutes || {}).some((route) => path.includes(route))) {
            return false;
        }

        return customProxy.length > 0 ? customProxy.reduce((acc, curr) => acc && !curr.context(path), true) : true;
    };

    const isChrome = (path) => localChrome && path.includes(process.env.BETA ? '/beta/apps/chrome/' : '/apps/chrome/');
    const pathInCustomUrl = (path) => appUrls && appUrls.some((customPath) => comparator(path, customPath));
    const removeHashQuery = (path) => path.replace(/(\?|#).*/, '');

    if (appUrls && proxyVerbose) {
        console.log('\n\nServing HTML on: ', appUrls.join(', '));
        console.log('Exact URL: ', exactUrl ? 'true' : 'false', '\n\n');
    }

    const router = transformUrl(target, useCloud);

    return {
        contentBase: `${rootFolder || ''}/dist`,
        index: `${rootFolder || ''}/dist/index.html`,
        host: `${betaEnv}.foo.redhat.com`,
        port,
        https,
        inline: true,
        disableHostCheck: true,
        historyApiFallback: true,
        writeToDisk: true,
        publicPath,
        proxy: [
            {
                context: (path) => isNotCustomContext(path) && !pathInCustomUrl(removeHashQuery(path)) && !isChrome(path),
                target,
                secure: false,
                changeOrigin: true,
                autoRewrite: true,
                router
            },
            ...(appUrl ? [{
                context: path => pathInCustomUrl(removeHashQuery(path)),
                target,
                secure: false,
                changeOrigin: true,
                autoRewrite: true,
                selfHandleResponse: true,
                // serve index.html from local and replace ESI tags for chrome
                onProxyReq: async (_proxyReq, req, res) => {
                    const fileName = removeHashQuery(req.url.split('/').pop()) || 'index.html';
                    let localPath = sync(`${rootFolder}/dist/${fileName}`);

                    if (!localPath[0] && !disableFallback) {
                        proxyVerbose && console.log(`page ${fileName} not found, fallback to index.html`);
                        localPath = sync(`${rootFolder}/dist/index.html`);
                    }

                    proxyVerbose && console.log('serving locally', req.url, '>', fileName, '--->', localPath[0], '\n\n');

                    if (localPath[0]) {
                        const localFile = readFileSync(localPath[0]);
                        const newData = await esi.process(localFile.toString());
                        res.end(newData);
                    }
                }
            }] : []),
            ...(localChrome ? [{
                context: (path) => isChrome(path),
                target,
                secure: false,
                changeOrigin: true,
                autoRewrite: true,
                ws: true,
                // When running chrome locally, we have to redirect all requests and serve files locally
                selfHandleResponse: true,
                onProxyReq: (_proxyReq, req, res) => {
                    let newPath = req.url;
                    const fileType = req.url.match(/\.([a-z]|\d)+$/);

                    newPath = newPath.replace(process.env.BETA ? '/beta/apps/chrome/' : '/apps/chrome/', ''); //remove chrome URL

                    let localPath = sync(`${localChrome}${newPath}`); // try to find it locally

                    // if the file does not exist locally and it is a JS/CSS, let's try to remove hash
                    if (localPath.length === 0 && fileType && (fileType[0] === '.js' || fileType[0] === '.css')) {
                        newPath = newPath
                        .replace(/\.([a-z]|\d)+\.[a-z]+$/, '**') //removeHash and add wilcard
                        .concat(fileType[0]); // add file extension back

                        localPath = sync(`${localChrome}${newPath}`);
                    }

                    proxyVerbose && console.log('serving locally', req.url, '--->', newPath, '------>', localPath[0], '\n\n');

                    // if there is a local file with the same name, it's served
                    if (localPath[0]) {
                        res.sendFile(localPath[0]);
                    }
                }
            }] : []),
            ...proxyRoutes ? Object.entries(proxyRoutes).map(([ route, redirect ]) => {
                const currTarget = redirect.host || redirect;
                delete redirect.host;
                return {
                    context: (path) => path.includes(route),
                    target: currTarget === 'PORTAL_BACKEND_MARKER' ? target : currTarget,
                    secure: false,
                    changeOrigin: true,
                    autoRewrite: true,
                    ws: true,
                    onProxyReq: (...args) => {
                        cookieTransform(...args);
                    },
                    ...(currTarget === 'PORTAL_BACKEND_MARKER' &&  { router }),
                    ...typeof redirect === 'object' ? redirect : {}
                };
            }) : [],
            ...customProxy
        ]
    };
};

