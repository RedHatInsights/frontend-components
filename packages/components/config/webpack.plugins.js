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
const LodashWebpackPlugin = new(require('lodash-webpack-plugin'))({
    currying: true,
    flattening: true,
    placeholders: true,
    paths: true,
    shorthands: true
});

module.exports = {
    buildPlugins: (env) => ({
        plugins: [
            WriteFileWebpackPlugin,
            LodashWebpackPlugin,
            ...env && env.server === 'true' ? [ HotModuleReplacementPlugin ] : []
        ]
    })
};
