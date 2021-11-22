/* eslint-disable camelcase */
const path = require('path');
const proxy = require('@redhat-cloud-services/frontend-components-config-utilities/proxy');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const searchIgnoredStyles = require('@redhat-cloud-services/frontend-components-config-utilities/search-ignored-styles');

module.exports = ({
    port,
    publicPath,
    appEntry,
    rootFolder,
    https,
    mode,
    appName,
    useFileHash = true,
    betaEnv,
    env,
    sassPrefix,
    skipChrome2 = false,
    useProxy,
    proxyURL,
    localChrome,
    keycloakUri,
    customProxy,
    routes,
    routesPath,
    isProd,
    standalone = false,
    reposDir,
    appUrl = [],
    proxyVerbose,
    useCloud,
    target,
    registry,
    client = {},
    bundlePfModules = false
} = {}) => {
    const filenameMask = `js/[name]${useFileHash ? '.[chunkhash]' : ''}.js`;
    if (betaEnv) {
        env = `${betaEnv}-beta`;
        console.warn('betaEnv is deprecated in favor of env');
    }

    const devServerPort = typeof port === 'number' ? port : useProxy || standalone ? 1337 : 8002;
    return {
        mode: mode || (isProd ? 'production' : 'development'),
        devtool: false,
        entry: {
            App: appEntry
        },
        output: {
            filename: filenameMask,
            path: `${rootFolder || ''}/dist`,
            publicPath,
            chunkFilename: filenameMask
        },
        module: {
            rules: [{
                test: new RegExp(appEntry),
                loader: path.resolve(__dirname, './chrome-render-loader.js'),
                options: {
                    appName,
                    skipChrome2
                }
            }, {
                test: /src\/.*\.js$/,
                exclude: /(node_modules|bower_components)/i,
                use: [ 'babel-loader' ]
            }, {
                test: /src\/.*\.tsx?$/,
                loader: 'ts-loader',
                exclude: /(node_modules)/i
            }, {
                test: /\.s?[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        /**
                         * Second sass loader used for scoping the css with class name.
                         * Has to be included as second in order to re-scope already compiled sass files.
                         * Second loader is required to avoid scoping mixins, includes and other sass partials. We want to only scope the CSS output.
                         */
                        loader: 'sass-loader',
                        options: {
                            additionalData: function(content, loaderContext) {
                                const { resourcePath, rootContext } = loaderContext;
                                const relativePath = path.relative(rootContext, resourcePath);
                                /**
                                 * Add app class context for local style files.
                                 * Context class is equal to app name and that class ass added to root element via the chrome-render-loader.
                                 */
                                if (relativePath.match(/^src/)) {
                                    return `${sassPrefix || `.${appName}`}{\n${content}\n}`;
                                }

                                return content;
                            }
                        }
                    },
                    'sass-loader'
                ]
            }, {
                test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
            {
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            }]
        },
        resolve: {
            extensions: [ '.ts', '.tsx', '.mjs', '.js', '.scss' ],
            alias: {
                ...(bundlePfModules ? {} : searchIgnoredStyles(rootFolder))
            },
            fallback: {
                path: require.resolve('path-browserify'),
                stream: require.resolve('stream-browserify'),
                zlib: require.resolve('browserify-zlib'),
                assert: require.resolve('assert/'),
                buffer: require.resolve('buffer/'),
                url: require.resolve('url/'),
                util: require.resolve('util/'),
                process: 'process/browser.js'
            }
        },
        devServer: {
            static: {
                directory: `${rootFolder || ''}/dist`
            },
            port: devServerPort,
            https: https || Boolean(useProxy),
            host: '0.0.0.0', // This shares on local network. Needed for docker.host.internal
            hot: false, // Use livereload instead of HMR which is spotty with federated modules
            allowedHosts: 'all',
            // https://github.com/bripkens/connect-history-api-fallback
            historyApiFallback: {
                // We should really implement the same logic as cloud-services-config
                // and only redirect (/beta)?/bundle/app-name to /index.html
                //
                // Until then let known api calls fall through instead of returning /index.html
                // for easier `fetch` debugging
                rewrites: [
                    { from: /^\/api/, to: '/404.html' },
                    { from: /^(\/beta)?\/config/, to: '/404.html' }
                ],
                verbose: Boolean(proxyVerbose)
            },
            devMiddleware: {
                writeToDisk: true
            },
            client,
            ...proxy({
                useCloud,
                env,
                localChrome,
                keycloakUri,
                customProxy,
                routes,
                routesPath,
                useProxy,
                proxyURL,
                standalone,
                port: devServerPort,
                reposDir,
                appUrl,
                publicPath,
                proxyVerbose,
                target,
                registry
            })
        }
    };
};
