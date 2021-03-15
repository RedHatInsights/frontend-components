const { readFileSync } = require('fs');
const { sync } = require('glob');

function createInsightsProxy({ betaEnv, rootFolder, localChrome, customProxy = [], publicPath, proxyVerbose, https = true, port }) {
    const target = betaEnv === 'prod' ? 'https://cloud.redhat.com/' : `https://${betaEnv}.cloud.redhat.com/`;

    const isNotCustomContext = (path) => customProxy.length > 0 ? customProxy.reduce((acc, curr) => acc && !curr.context(path), true) : true;

    return {
        contentBase: `${rootFolder || ''}/dist`,
        index: `${rootFolder || ''}/dist/index.html`,
        host: `${betaEnv}.foo.redhat.com`,
        port: port || 1337,
        https,
        inline: true,
        disableHostCheck: true,
        historyApiFallback: true,
        writeToDisk: true,
        publicPath,
        proxy: [
            {
                context: (path) => localChrome
                    ? isNotCustomContext(path) && !path.includes(process.env.BETA ? '/beta/apps/chrome/' : '/apps/chrome/') || path.includes('.svg')
                    : isNotCustomContext(path),
                target,
                secure: false,
                changeOrigin: true,
                autoRewrite: true,
                ws: true
            },
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

                    // eslint-disable-next-line no-console
                    proxyVerbose && console.log('serving locally', req.url, '--->', newPath, '------>', localPath[0], '\n\n');

                    // if there is a local file with the same name, it's served
                    if (localPath[0]) {
                        const localFile = readFileSync(localPath[0]);
                        res.end(localFile);
                    }
                }
            }] : []),
            ...customProxy
        ]
    };
}

module.exports = createInsightsProxy;
