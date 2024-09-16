import federatedModules from './federated-modules';
import FECConfiguration from '../lib/fec.config';
import generatePFSharedAssetsList from './generate-pf-shared-assets-list';
import { RspackPluginInstance, WebpackPluginInstance } from '@rspack/core';

const rootDir = process.env.FEC_ROOT_DIR || process.cwd();
const fecConfig: FECConfiguration = require(process.env.FEC_CONFIG_PATH!);

const plugins: (WebpackPluginInstance | RspackPluginInstance)[] = [
  federatedModules({
    root: rootDir,
    useFileHash: process.env.NODE_ENV === 'production',
    separateRuntime: typeof fecConfig.hotReload !== 'undefined' ? !!fecConfig.hotReload : !!fecConfig._unstableHotReload,
    /** Load optional config for federated modules */
    ...fecConfig.moduleFederation,
    shared: [
      ...(fecConfig.moduleFederation?.shared || []),
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

export default plugins;
module.exports = plugins;
