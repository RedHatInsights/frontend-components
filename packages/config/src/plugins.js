const { resolve } = require('path');
const { readFileSync } = require('fs');
const { ProvidePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
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
    standalonePath
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
            ...isStandalone ? [{
                pattern: /<\s*esi:include\s+src\s*=\s*"([^"]+)"\s*\/\s*>/gm,
                replacement(_match, file) {
                    file = file.split('/').pop();
                    const snippet = resolve(standalonePath, 'repos/insights-chrome-build/snippets', file);
                    return readFileSync(snippet);
                }
            }] : [],
            ...replacePlugin || []
        ]),
        // ESLintPlugin,
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
