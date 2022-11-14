const webpack = require('webpack');
const { resolve } = require('path');
const fedModulePlugin = require('@redhat-cloud-services/frontend-components-config/federated-modules');

const rootDir = process.env.FEC_ROOT_DIR || process.cwd();
const fecConfig = require(process.env.FEC_CONFIG_PATH);

const plugins = [
  fedModulePlugin({
    root: rootDir,
    useFileHash: process.env.NODE_ENV === 'production',
    /** Load optional config for federated modules */
    ...fecConfig.moduleFederation,
  }),
];

// Save 20kb of bundle size in prod
if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.NormalModuleReplacementPlugin(/redux-logger/, resolve(__dirname, './empty.js')));
}

module.exports = plugins;
