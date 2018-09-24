const merge = require('lodash/merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./webpack.common.js');
const { resolve } = require('path');
const pkg = require('../package.json');
const { externals, entries } = require('./build-constants');
const { buildPlugins } = require('./webpack-build.plugins.js');
const webpack_config = (env) => {
    const isServer = env && env.server === 'true';
    return {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        devtool: false,
        optimization: {
            minimize: process.env.NODE_ENV === 'production'
        },
        entry: {
            index: './src/index.js',
            ...entries,
            ...isServer ? {
                demo: './demo/index.js'
            } : {}
        },
        output: {
            filename: '[name].js',
            path: isServer ? resolve(__dirname, '../dist') : config.paths.build,
            library: 'InsightsComponentsRegistery-[name]',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/i,
                use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }]
            }, {
                test: /\.s?[ac]ss$/,
                use: [
                    process.env.NODE_ENV === 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                ...Object.values(pkg.sassIncludes).map(includePath =>
                                    resolve(__dirname, `../${includePath}`)
                                )
                            ]
                        }
                    }
                ]
            }, {
                test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: isServer ? 'fonts/' : '/insights/static/chrome/assets/fonts',
                        emitFile: isServer ? true : false
                    }
                }]
            }]
        },
        externals: isServer ? {} : externals,
        devServer: {
            port: 4005,
            publicPath: '/',
            inline: true,
            noInfo: false,
            contentBase: './dist',
            hot: true,
            clientLogLevel: 'none'
        }
    };
};

module.exports = (env) => merge({},
    webpack_config(env),
    buildPlugins(env)
);
