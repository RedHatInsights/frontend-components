/**
 * Plugins used by webpack bundler
 */
const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.common');
const plugins = [];

/**
 * Writes bundles to distribution folder.
 *
 * @type {var}
 */
const WriteFileWebpackPlugin = new (require('write-file-webpack-plugin'))();

/**
 * Copys entry html to distribution folder
 *
 * @type {var}
 */
const HtmlWebpackPlugin = new (require('html-webpack-plugin'))({
    title: 'Playground',
    template: path.resolve(__dirname, '../demo/index.html'),
    chunks: ['demo']
});

const HotModuleReplacementPlugin = new (require('webpack').HotModuleReplacementPlugin)();

/**
 * Cleans distribution folder.
 * @type {[type]}
 */
const CleanWebpackPlugin = new (require('clean-webpack-plugin'))(['dist']);

/**
 * Selects the specific lodash functions.
 *
 * @type {var}
 */
const LodashWebpackPlugin = new (require('lodash-webpack-plugin'))({ currying: true, flattening: true, placeholders: true });

/**
 * Optimizes bundle size
 *
 * @type {var}
 */
const AggressiveSplittingPlugin = new webpack.optimize.AggressiveSplittingPlugin({
    minSize: 30000,
    maxSize: 50000
});

/**
 * Writes final css to file
 */
const ExtractCssWebpackPlugin = new (require('mini-css-extract-plugin'))({
    chunkFilename: '[name].css',
    filename: '[id].css'
});

/**
 * Copies files from the specified locations to the corresponding destinations.
 */
const CopyFilesWebpackPlugin = new (require('copy-webpack-plugin'))([
    {from: path.resolve(__dirname, '../static/images'), to: 'images'},
    {from: path.resolve(__dirname, '../src/PresentationalComponents'), to: 'components'}
]);

module.exports = { buildPlugins: (env) => ({
    plugins: [
        WriteFileWebpackPlugin,
        CleanWebpackPlugin,
        LodashWebpackPlugin,
        ExtractCssWebpackPlugin,
        ...env && env.server === 'true' ? [HtmlWebpackPlugin, HotModuleReplacementPlugin] : []
    ]
}) };
