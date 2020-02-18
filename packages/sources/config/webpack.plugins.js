/**
 * Plugins used by webpack bundler
 */
const webpack = require('webpack');
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
 * Makes build-time env vars available to the client-side as constants
 */
const envPlugin = new webpack.DefinePlugin({
    'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/api'),
    'process.env.FAKE_IDENTITY': JSON.stringify(process.env.FAKE_IDENTITY)
});

module.exports = { buildPlugins: (env) => ({
    plugins: [
        WriteFileWebpackPlugin,
        LodashWebpackPlugin,
        envPlugin,
        ...env && env.server === 'true' ? [ HotModuleReplacementPlugin ] : []
    ]
}) };
