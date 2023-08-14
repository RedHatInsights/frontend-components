import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';
import { Compiler, WebpackPluginInstance } from 'webpack';

const { SourceMapDevToolPlugin } = require('webpack');
const { ProvidePlugin, DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { glob } = require('glob');
const path = require('path');

export type WebpackPluginDefinition = undefined | null | false | '' | 0 | ((this: Compiler, compiler: Compiler) => void) | WebpackPluginInstance;

export type CreatePluginsOptions = {
  rootFolder: string;
  appname?: string;
  generateSourceMaps?: boolean;
  plugins?: WebpackPluginDefinition[];
  definePlugin?: Record<string, any>;
  hotReload?: boolean;
  useFileHash?: boolean;
};

export const createPlugins = ({
  rootFolder,
  appname,
  generateSourceMaps,
  plugins,
  definePlugin = {},
  hotReload = false,
  useFileHash = true,
}: CreatePluginsOptions) => {
  if (!rootFolder) {
    fecLogger(LogType.error, 'rootFolder is required attribute for the createPlugins function!');
    throw new Error('No rootFolder defined!');
  }
  const hasTsConfig = glob.sync(path.resolve(rootFolder, './{tsconfig.json,!(node_modules)/**/tsconfig.json}')).length > 0;
  const fileHash = !hotReload && useFileHash;
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
    new MiniCssExtractPlugin({
      chunkFilename: !fileHash ? 'css/[name].css' : 'css/[name].[contenthash].css',
      filename: !fileHash ? 'css/[name].css' : 'css/[name].[contenthash].css',
      ignoreOrder: true,
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
    }),
    new DefinePlugin({
      // we have to wrap the appname string in another string because of how define plugin explodes strings
      CRC_APP_NAME: JSON.stringify(appname),
      ...definePlugin,
    }),
    new ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    ...(hasTsConfig ? [new ForkTsCheckerWebpackPlugin()] : []),
    ...(plugins || []),
    ...(hotReload ? [new ReactRefreshWebpackPlugin()] : []),
  ];
};

export default createPlugins;
module.exports = createPlugins;
