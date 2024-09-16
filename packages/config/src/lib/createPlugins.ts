import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';
import { Compiler, DefinePlugin, ProvidePlugin, RspackPluginInstance, SourceMapDevToolPlugin, WebpackPluginInstance } from '@rspack/core';
import { CommonConfigOptions } from './createConfig';

export type RspackPluginDefinition =
  | undefined
  | null
  | false
  | ''
  | 0
  | ((this: Compiler, compiler: Compiler) => void)
  | RspackPluginInstance
  | WebpackPluginInstance;

export interface CreatePluginsOptions extends CommonConfigOptions {
  generateSourceMaps?: boolean;
  plugins?: RspackPluginDefinition[];
  definePlugin?: Record<string, any>;
}

export const createPlugins = ({
  rootFolder,
  appName,
  generateSourceMaps,
  plugins,
  definePlugin = {},
  _unstableHotReload,
  hotReload,
  useFileHash = true,
}: CreatePluginsOptions) => {
  if (!rootFolder) {
    fecLogger(LogType.error, 'rootFolder is required attribute for the createPlugins function!');
    throw new Error('No rootFolder defined!');
  }
  const internalHotReload = !!(typeof hotReload !== 'undefined' ? hotReload : _unstableHotReload);
  // const hasTsConfig = glob.sync(path.resolve(rootFolder, './{tsconfig.json,!(node_modules)/**/tsconfig.json}')).length > 0;
  const fileHash = !internalHotReload && useFileHash;
  return [
    ...(generateSourceMaps
      ? [
          new SourceMapDevToolPlugin({
            test: 'js',
            exclude: /(node_modules|bower_components)/i,
            filename: !fileHash ? 'sourcemaps/[name].js.map' : 'sourcemaps/[name].[contenthash].js.map',
          }),
        ]
      : []),
    new DefinePlugin({
      // we have to wrap the appName string in another string because of how define plugin explodes strings
      CRC_APP_NAME: JSON.stringify(appName),
      ...definePlugin,
    }),
    new ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    ...(plugins || []),
  ];
};

export default createPlugins;
module.exports = createPlugins;
