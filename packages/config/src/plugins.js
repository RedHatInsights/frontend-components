const { SourceMapDevToolPlugin, HotModuleReplacementPlugin } = require('webpack');
const ProvidePlugin = new(require('webpack').ProvidePlugin)({
    process: 'process/browser.js',
    Buffer: [ 'buffer', 'Buffer' ]
});

const SourceMapsPlugin = new SourceMapDevToolPlugin({
    test: 'js',
    exclude: /(node_modules|bower_components)/i,
    filename: `sourcemaps/[name].[hash].js.map`
});
const ExtractCssWebpackPlugin = new(require('mini-css-extract-plugin'))({
    chunkFilename: 'css/[name].[contenthash].css',
    filename: 'css/[name].[contenthash].css'
});
const CleanWebpackPlugin = new(require('clean-webpack-plugin').CleanWebpackPlugin)({ cleanStaleWebpackAssets: false });
const WebpackHotModuleReplacement = new HotModuleReplacementPlugin();
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

    const ChunkMapper = new(require('@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper'))({ modules: [
        ...insights ? [ jsVarName(insights.appname) ] : [],
        ...modules || []
    ] });

    return [
        ...(generateSourceMaps ? [ SourceMapsPlugin ] : []),
        ExtractCssWebpackPlugin,
        CleanWebpackPlugin,
        HtmlWebpackPlugin,
        HtmlReplaceWebpackPlugin,
        WebpackHotModuleReplacement,
        ProvidePlugin,
        ChunkMapper,
        ...(plugins || [])
    ];
};
