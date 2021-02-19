const { ProvidePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const { getHtmlReplacements } = require('@redhat-cloud-services/insights-standalone');
const ChunkMapperPlugin = require('../chunk-mapper');

module.exports = ({
    rootFolder,
    appDeployment,
    htmlPlugin,
    replacePlugin,
    insights,
    modules,
    plugins,
    isStandalone,
    chromePath
} = {}) => {
    return [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new ProvidePlugin({
            process: 'process/browser.js',
            Buffer: [ 'buffer', 'Buffer' ]
        }),
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'index.html',
            template: `${rootFolder || ''}/src/index.html`,
            ...htmlPlugin || {}
        }),
        new HtmlReplaceWebpackPlugin([
            {
                pattern: '@@env',
                replacement: appDeployment || ''
            },
            ...isStandalone ? getHtmlReplacements(chromePath) : [],
            ...replacePlugin || []
        ]),
        new ChunkMapperPlugin(),
        new MiniCssExtractPlugin({
            chunkFilename: 'css/[name].[contenthash].css',
            filename: 'css/[name].[contenthash].css',
            ignoreOrder: true
        }),
        new ChunkMapperPlugin({ modules: [
            ...insights ? [ insights.appname ] : [],
            ...modules || []
        ] }),
        ...(plugins || [])
    ];
};
