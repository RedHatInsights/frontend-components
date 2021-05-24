const { SourceMapDevToolPlugin } = require('webpack');
const { ProvidePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const ChunkMapperPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper');
const jsVarName = require('@redhat-cloud-services/frontend-components-config-utilities/jsVarName');

module.exports = ({
    rootFolder,
    appDeployment,
    htmlPlugin,
    replacePlugin,
    insights,
    modules,
    generateSourceMaps,
    plugins
} = {}) => [
    ...(generateSourceMaps
        ? [
            new SourceMapDevToolPlugin({
                test: 'js',
                exclude: /(node_modules|bower_components)/i,
                filename: 'sourcemaps/[name].[hash].js.map'
            })
        ]
        : []),
    new MiniCssExtractPlugin({
        chunkFilename: 'css/[name].[contenthash].css',
        filename: 'css/[name].[contenthash].css',
        ignoreOrder: true
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
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
        ...replacePlugin || []
    ]),
    new ProvidePlugin({
        process: 'process/browser.js',
        Buffer: [ 'buffer', 'Buffer' ]
    }),
    new ChunkMapperPlugin({ modules: [
        ...insights ? [ jsVarName(insights.appname) ] : [],
        ...modules || []
    ] }),
    ...(plugins || [])
];
