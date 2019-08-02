/**
 * Plugins used by webpack bundler
 */
const path = require('path');

/**
 * Writes bundles to distribution folder.
 *
 * @type {var}
 */
const WriteFileWebpackPlugin = new(require('write-file-webpack-plugin'))();

const HotModuleReplacementPlugin = new(require('webpack').HotModuleReplacementPlugin)();

/**
 * Selects the specific lodash functions.
 *
 * @type {var}
 */
const LodashWebpackPlugin = new(require('lodash-webpack-plugin'))({ currying: true, flattening: true, placeholders: true, paths: true });

/**
 * Writes final css to file
 */
const ExtractCssWebpackPlugin = new(require('mini-css-extract-plugin'))({
    chunkFilename: '[name].css',
    filename: '[id].css'
});

const CopyFilesWebpackPlugin = new(require('copy-webpack-plugin'))([
    { from: 'src/**/*.scss', to: 'files/Utilities', flatten: true },
    { from: 'src/mergeMessages.js', to: 'files/mergeMessages.js' }
]);

module.exports = { buildPlugins: (env) => ({
    plugins: [
        WriteFileWebpackPlugin,
        LodashWebpackPlugin,
        ExtractCssWebpackPlugin,
        CopyFilesWebpackPlugin,
        ...env && env.server === 'true' ? [ HtmlWebpackPlugin, HotModuleReplacementPlugin ] : []
    ]
}) };
