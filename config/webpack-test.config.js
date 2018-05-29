const merge = require('lodash/merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./webpack.common.js');
const { resolve } = require('path');
const pkg = require('../package.json');

const webpack_config_test = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: false,
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        splitChunks: {
            cacheGroups: {
                vendors: false,
                commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name: "vendor",
                  chunks: "initial"
                }
            },
        },
    },
    entry: {
        App: config.paths.entry
    },
    output: {
        filename: 'js/[name].js',
        path: config.paths.public,
        publicPath: '/insights',
        chunkFilename: 'js/[name].js'
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
    }
};

module.exports = merge({},
    webpack_config_test,
    require('./webpack-test.plugins.js'),
    require('./webpack.server.js')
);
