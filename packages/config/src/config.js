/* eslint-disable camelcase */
const path = require('path');
const proxy = require('@redhat-cloud-services/frontend-components-config-utilities/proxy');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    localChrome,
    customProxy,
    routes,
    routesPath,
    isProd,
    standalone = false,
    reposDir,
    appUrl = [],
    proxyVerbose,
    useCloud,
    exactUrl
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
        optimization: {
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    reactVendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'reactVendor',
                        priority: 10
                    },
                    pfVendor: {
                        test: /[\\/]node_modules[\\/](@patternfly)[\\/]/,
                        name: 'pfVendor',
                        priority: 10
                    },
                    rhcsVendor: {
                        test: /[\\/]node_modules[\\/](@redhat-cloud-services)[\\/]/,
                        name: 'rhcsVendor',
                        priority: 10
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        priority: 9
                    }
                }
            }
        },
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
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
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
                customReact: 'react',
                PFReactCore: '@patternfly/react-core',
                PFReactTable: '@patternfly/react-table'
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
            contentBase: `${rootFolder || ''}/dist`,
            port: devServerPort,
            https: https || Boolean(useProxy),
            hot: false, // Use livereload instead of HMR which is spotty with federated modules
            disableHostCheck: true,
            writeToDisk: true,
            ...proxy({
                useCloud,
                env,
                localChrome,
                customProxy,
                routes,
                routesPath,
                useProxy,
                rootFolder,
                standalone,
                port: devServerPort,
                reposDir,
                appUrl,
                publicPath,
                proxyVerbose,
                exactUrl
            })
        }
    };
};
