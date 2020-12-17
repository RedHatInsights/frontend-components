const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { resolve } = require('path');
const { externals } = require('./webpack.constants.js');
const { buildPlugins } = require('./webpack.plugins.js');

module.exports = (env) => ({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'source-map',
    optimization: {
        minimize: process.env.NODE_ENV === 'production',
        minimizer: [ new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({}) ]
    },
    entry: {
        index: './src/index.js',
        remediationsApi: './src/api/index.js'
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../'),
        library: 'CloudServicesComponents[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /src\/.*\.js$/,
            exclude: /(node_modules|bower_components)/i,
            use: [{ loader: 'source-map-loader' }, {
                loader: 'babel-loader'
            }]
        }, {
            test: /\.s?[ac]ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader'
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
                    name: '[name].[ext]'
                }
            }]
        }]
    },
    externals,
    ...buildPlugins(env)
});
