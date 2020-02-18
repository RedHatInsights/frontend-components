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

const CopyFilesWebpackPlugin = new(require('copy-webpack-plugin'))([
    { from: 'src/mergeMessages.js', to: 'files/mergeMessages.js' }
]);

module.exports = { buildPlugins: (env) => ({
    plugins: [
        WriteFileWebpackPlugin,
        LodashWebpackPlugin,
        CopyFilesWebpackPlugin,
        ...env && env.server === 'true' ? [ HotModuleReplacementPlugin ] : []
    ]
}) };
