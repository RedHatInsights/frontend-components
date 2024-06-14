import { LogType, fecLogger, federatedModules, generatePFSharedAssetsList } from '@redhat-cloud-services/frontend-components-config-utilities';
import FECConfiguration from '../lib/fec.config';

const rootDir = process.env.FEC_ROOT_DIR || process.cwd();
const fecConfig: FECConfiguration = require(process.env.FEC_CONFIG_PATH!);

if (typeof fecConfig._unstableHotReload !== 'undefined') {
  fecLogger(LogType.warn, `The _unstableHotReload option in fec.config.js is deprecated. Use hotReload config instead.`);
}

const plugins = [
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
