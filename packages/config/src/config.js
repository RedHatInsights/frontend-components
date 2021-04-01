/* eslint-disable camelcase */
const path = require('path');
const proxy = require('./proxy');

let rewriteLineCounter = 0;

module.exports = ({
    port,
    publicPath,
    appEntry,
    rootFolder,
    https,
    mode,
    appName,
    useFileHash = true,
    betaEnv = 'ci',
    sassPrefix,
    deployment,
    skipChrome2 = false,
    useProxy,
    localChrome,
    customProxy,
    proxyVerbose,
    routes,
    routesPath,
    appUrl,
    exactUrl
} = {}) => {
    const filenameMask = `js/[name]${useFileHash ? '.[chunkhash]' : ''}.js`;
    return {
        mode: mode || (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
        devtool: false,
        optimization: {
            minimize: (process.env.NODE_ENV || mode) === 'production',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    reactVendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'reactvendor'
                    },
                    pfVendor: {
                        test: /[\\/]node_modules[\\/](@patternfly)[\\/]/,
                        name: 'pfVendor'
                    },
                    rhcsVendor: {
                        test: /[\\/]node_modules[\\/](@redhat-cloud-services)[\\/]/,
                        name: 'rhcsVendor'
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/](!react-dom)(!react)(!@patternfly)(!@redhat-cloud-services)[\\/]/,
                        name: 'vendor'
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
                enforce: 'pre',
                use: [ 'source-map-loader' ]
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
                    'style-loader',
                    {
                        loader: 'css-loader'
                    },
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
                    {
                        loader: 'sass-loader'
                    }
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
                PFReactTable: '@patternfly/react-table',
                buffer: 'buffer'
            },
            fallback: {
                path: require.resolve('path-browserify'),
                stream: require.resolve('stream-browserify'),
                zlib: require.resolve('browserify-zlib'),
                assert: require.resolve('assert/'),
                buffer: require.resolve('buffer/'),
                util: require.resolve('util/'),
                process: 'process/browser.js'
            }
        },
        devServer: useProxy ? proxy({
            betaEnv,
            rootFolder,
            localChrome,
            customProxy,
            appName,
            publicPath,
            https,
            port,
            proxyVerbose,
            routes,
            routesPath,
            appUrl,
            exactUrl
        }) : {
            contentBase: `${rootFolder || ''}/dist`,
            hot: true,
            port: port || 8002,
            https: https || false,
            inline: true,
            disableHostCheck: true,
            historyApiFallback: true,
            writeToDisk: true,
            proxy: !deployment && betaEnv ? {
                [`https://${betaEnv}.foo.redhat.com:1337/beta`]: {
                    target: `http${https ? 's' : ''}://localhost:${port || 8002}`,
                    pathRewrite: function(path) {
                        const pathRewrite = path.replace(/^\/beta\//, '/');
                        if (rewriteLineCounter === 0) {
                            // eslint-disable-next-line max-len
                            console.warn('\x1b[33m%s\x1b[0m', `[${rewriteLineCounter}]Warning, automatic beta rewrites are deprecated.`, 'Please use deployment configuration to use beta env: https://github.com/RedHatInsights/frontend-starter-app/pull/421/files');
                            rewriteLineCounter += 1;
                        }

                        console.warn('\x1b[33m%s\x1b[0m', `[${rewriteLineCounter}]PROXY: Rewriting from path to beta to stable:`, path, '->', pathRewrite);
                        rewriteLineCounter += 1;
                        return pathRewrite;
                    }
                }
            } : undefined
        }
    };
};
