/* eslint-disable camelcase */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = ({
    port,
    publicPath,
    appEntry,
    rootFolder,
    https,
    mode,
    appName
} = {}) => {
    return {
        mode: mode || (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
        devtool: 'source-map',
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
            filename: 'js/[name].[chunkhash].js',
            path: `${rootFolder || ''}/dist`,
            publicPath,
            chunkFilename: 'js/[name].[chunkhash].js'
        },
        module: {
            rules: [{
                test: new RegExp(appEntry),
                loader: path.resolve(__dirname, './chrome-render-loader.js')
            }, {
                test: /src\/.*\.js$/,
                exclude: /(node_modules|bower_components)/i,
                use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
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
                        loader: path.resolve(__dirname, './css-prefix-loader.js'),
                        options: {
                            prefix: appName
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
        devServer: {
            contentBase: `${rootFolder || ''}/dist`,
            hot: true,
            port: port || 8002,
            https: https || false,
            inline: true,
            disableHostCheck: true,
            historyApiFallback: true,
            writeToDisk: true
        }
    };
};
