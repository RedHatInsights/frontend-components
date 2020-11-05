const { SourceMapDevToolPlugin, HotModuleReplacementPlugin } = require('webpack');

const WriteFileWebpackPlugin = new(require('write-file-webpack-plugin'))();
const SourceMapsPlugin = new SourceMapDevToolPlugin({
    test: /src\/.*\.js$/i,
    exclude: /(node_modules|bower_components)/i,
    filename: `sourcemaps/[name][hash].js.map`
});
const LodashWebpackPlugin = new(require('lodash-webpack-plugin'))({
    currying: true,
    flattening: true,
    placeholders: true,
    paths: true,
    shorthands: true
});
const ExtractCssWebpackPlugin = new(require('mini-css-extract-plugin'))({
    chunkFilename: 'css/[name].[hash].css',
    filename: 'css/[name].[hash].css'
});
const CleanWebpackPlugin = new(require('clean-webpack-plugin'))();
const WebpackHotModuleReplacement = new HotModuleReplacementPlugin();

module.exports = ({
    rootFolder,
    appDeployment,
    htmlPlugin,
    replacePlugin
} = {}) => {
    const HtmlWebpackPlugin = new(require('html-webpack-plugin'))({
        title: 'My App',
        filename: 'index.html',
        template: `${rootFolder || ''}/src/index.html`,
        ...htmlPlugin || {}
    });

    const HtmlReplaceWebpackPlugin = new(require('html-replace-webpack-plugin'))([
        {
            pattern: '@@env',
            replacement: appDeployment || ''
        },
        ...replacePlugin || []
    ]);

    return [
        WriteFileWebpackPlugin,
        SourceMapsPlugin,
        LodashWebpackPlugin,
        ExtractCssWebpackPlugin,
        CleanWebpackPlugin,
        HtmlWebpackPlugin,
        HtmlReplaceWebpackPlugin,
        WebpackHotModuleReplacement
    ];
};
