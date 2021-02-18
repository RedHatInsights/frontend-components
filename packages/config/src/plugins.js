const { resolve } = require('path');
const { readFileSync } = require('fs');
const { SourceMapDevToolPlugin, HotModuleReplacementPlugin } = require('webpack');
const ProvidePlugin = new(require('webpack').ProvidePlugin)({
    process: 'process/browser.js',
    Buffer: [ 'buffer', 'Buffer' ]
});

const SourceMapsPlugin = new SourceMapDevToolPlugin({
    test: /src\/.*\.js$/i,
    exclude: /(node_modules|bower_components)/i,
    filename: `sourcemaps/[name][hash].js.map`
});
const ExtractCssWebpackPlugin = new(require('mini-css-extract-plugin'))({
    chunkFilename: 'css/[name].[contenthash].css',
    filename: 'css/[name].[contenthash].css',
    ignoreOrder: true
});
const CleanWebpackPlugin = new(require('clean-webpack-plugin').CleanWebpackPlugin)({ cleanStaleWebpackAssets: false });
const WebpackHotModuleReplacement = new HotModuleReplacementPlugin();

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
        ...isStandalone ? [{
            pattern: /<\s*esi:include\s+src\s*=\s*"([^"]+)"\s*\/\s*>/gm,
            replacement(_match, file) {
                file = file.split('/').pop();
                const snippet = resolve(standalonePath, 'repos', 'insights-chrome-build', 'snippets', file);
                return readFileSync(snippet);
            }
        }] : [],
        ...replacePlugin || []
    ]);

    const ChunkMapper = new(require('../chunk-mapper'))({ modules: [
        ...insights ? [ insights.appname ] : [],
        ...modules || []
    ] });

    return [
        // SourceMapsPlugin,
        ExtractCssWebpackPlugin,
        CleanWebpackPlugin,
        HtmlWebpackPlugin,
        HtmlReplaceWebpackPlugin,
        // WebpackHotModuleReplacement,
        // ESLintPlugin,
        ProvidePlugin,
        ChunkMapper,
        ...(plugins || [])
    ];
};
