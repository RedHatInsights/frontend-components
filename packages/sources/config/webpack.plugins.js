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

module.exports = { buildPlugins: (env) => ({
    plugins: [
        WriteFileWebpackPlugin,
        LodashWebpackPlugin,
        ExtractCssWebpackPlugin,
        ...env && env.server === 'true' ? [ HotModuleReplacementPlugin ] : []
    ]
}) };
