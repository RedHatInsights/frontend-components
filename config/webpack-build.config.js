const merge = require('lodash/merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./webpack.common.js');
const { resolve } = require('path');
const pkg = require('../package.json');
const { externals } = require('./build-constants');

const webpack_config = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: false,
    optimization: {
        minimize: process.env.NODE_ENV === 'production'
    },
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: config.paths.build,
        library: 'InsightsComponentsRegistery',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/i,
            use: [{loader: "source-map-loader"}, {loader: 'babel-loader'}]
        }, {
           test: /\.s?[ac]ss$/,
            use: [
                process.env.NODE_ENV === 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                    loader: "css-loader"
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
                    outputPath: 'fonts/'
                }
            }]
        }]
    },
    externals: externals,
};

module.exports = merge({},
    webpack_config,
    require('./webpack-build.plugins.js')
);
