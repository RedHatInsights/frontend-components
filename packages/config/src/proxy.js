/* eslint-disable no-console */
const { readFileSync } = require('fs');
const { sync } = require('glob');
const ESI = require('nodesi');

function createInsightsProxy({ betaEnv, rootFolder, localChrome, customProxy = [], publicPath, proxyVerbose, https = true, port = 1337, routes, routesPath, appUrl }) {
    // disable self signed CERT checks for esi
    if (appUrl) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    }

    const target = betaEnv === 'prod' ? 'https://cloud.redhat.com/' : `https://${betaEnv}.cloud.redhat.com/`;

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

    const customPaths = [
        ...(localChrome ? [ process.env.BETA ? '/beta/apps/chrome/' : '/apps/chrome/' ] : []),
        ...(appUrl ? [ appUrl ] : [])
    ];
    const pathInCustomPaths = (path) => customPaths.some((customPath) => path.includes(customPath));

    if (appUrl && proxyVerbose) {
        console.log('\n\nServing index html on: ', appUrl, '\n\n');
    }

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
                context: (path) => (isNotCustomContext(path) && !pathInCustomPaths(path)) || path.includes('.svg'),
                target,
                secure: false,
                changeOrigin: true,
                autoRewrite: true
            },
            ...(appUrl ? [{
                context: path => path.includes(appUrl),
                target,
                secure: false,
                changeOrigin: true,
                autoRewrite: true,
                selfHandleResponse: true,
                // serve index.html from local and replace ESI tags for chrome
                onProxyReq: async (_proxyReq, req, res) => {
                    const localPath = sync(`${rootFolder}/dist/index.html`);

                    proxyVerbose && console.log('serving locally', req.url, '--->', localPath[0], '\n\n');

                    if (localPath[0]) {
                        const localFile = readFileSync(localPath[0]);
                        const newData = await esi.process(localFile.toString());
                        res.end(newData);
                    }
                }
            }] : []),
            ...(localChrome ? [{
                context: (path) => path.includes(process.env.BETA ? '/beta/apps/chrome/' : '/apps/chrome/') && !path.includes('.svg'),
                target,
                secure: false,
                changeOrigin: true,
                autoRewrite: true,
                ws: true,
                // When running chrome locally, we have to redirect all requests and serve files locally
                selfHandleResponse: true,
                onProxyReq: (_proxyReq, req, res) => {
                    const newPath = req.url
                    .replace(/\.([a-z]|\d)+\.[a-z]+$/, '**') //removeHash and add wilcard
                    .replace(process.env.BETA ? '/beta/apps/chrome/' : '/apps/chrome/', ''); //remove chrome URL

                    const localPath = sync(`${localChrome}${newPath}`);

                    proxyVerbose && console.log('serving locally', req.url, '--->', newPath, '------>', localPath[0], '\n\n');

                    // if there is a local file with the same name, it's served
                    if (localPath[0]) {
                        const localFile = readFileSync(localPath[0]);
                        res.end(localFile);
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
                    ...typeof redirect === 'object' ? redirect : {}
                };
            }) : [],
            ...customProxy
        ]
    };
}

module.exports = createInsightsProxy;
