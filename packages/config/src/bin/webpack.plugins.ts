const webpack = require('webpack');
const { resolve } = require('path');
import { federatedModules, generatePFSharedAssetsList } from '@redhat-cloud-services/frontend-components-config-utilities';

const rootDir = process.env.FEC_ROOT_DIR || process.cwd();
const fecConfig = require(process.env.FEC_CONFIG_PATH!);

const plugins = [
  federatedModules({
    root: rootDir,
    useFileHash: process.env.NODE_ENV === 'production',
    separateRuntime: !!fecConfig._unstableHotReload,
    /** Load optional config for federated modules */
    ...fecConfig.moduleFederation,
    shared: [
      ...(fecConfig.moduleFederation.shared || []),
      Object.entries(generatePFSharedAssetsList(rootDir)).reduce<{
        [moduleName: string]: {
          version: string;
        };
      }>((acc, [name, config]) => {
        acc[name] = {
          version: config.requiredVersion,
        };
        return acc;
      }, {}),
    ],
  }),
];

// Save 20kb of bundle size in prod
if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.NormalModuleReplacementPlugin(/redux-logger/, resolve(__dirname, './empty.js')));
}

export default plugins;
module.exports = plugins;
