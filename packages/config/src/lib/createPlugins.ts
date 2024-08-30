import fetch from 'node-fetch';
import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';
import { Compiler, WebpackPluginInstance } from 'webpack';
import { CommonConfigOptions } from './createConfig';

// const { SourceMapDevToolPlugin } = require('webpack');
const { ProvidePlugin, DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { glob } = require('glob');
const path = require('path');

const chromeIndexHtmlUrl = (env = 'dev-stable') => {
  return `https://raw.githubusercontent.com/RedHatInsights/insights-chrome-build/${env}/index.html`;
};

export type WebpackPluginDefinition = undefined | null | false | '' | 0 | ((this: Compiler, compiler: Compiler) => void) | WebpackPluginInstance;

export interface CreatePluginsOptions extends CommonConfigOptions {
  generateSourceMaps?: boolean;
  plugins?: WebpackPluginDefinition[];
  definePlugin?: Record<string, any>;
  useProxy?: boolean;
  useDevBuild?: boolean;
  localChrome?: string;
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
  useProxy,
  useDevBuild,
  env,
  localChrome,
  ...rest
}: CreatePluginsOptions) => {
  console.log('REST', rest);
  if (!rootFolder) {
    fecLogger(LogType.error, 'rootFolder is required attribute for the createPlugins function!');
    throw new Error('No rootFolder defined!');
  }
  if (typeof _unstableHotReload !== 'undefined') {
    fecLogger(LogType.warn, `The _unstableHotReload option in shared webpack plugins config is deprecated. Use hotReload config instead.`);
  }
  const internalHotReload = !!(typeof hotReload !== 'undefined' ? hotReload : _unstableHotReload);
  const hasTsConfig = glob.sync(path.resolve(rootFolder, './{tsconfig.json,!(node_modules)/**/tsconfig.json}')).length > 0;
  const fileHash = !internalHotReload && useFileHash;
  return [
    // ...(generateSourceMaps
    //   ? [
    //       new SourceMapDevToolPlugin({
    //         test: 'js',
    //         exclude: /(node_modules|bower_components)/i,
    //         filename: !fileHash ? 'sourcemaps/[name].js.map' : 'sourcemaps/[name].[contenthash].js.map',
    //       }),
    //     ]
    //   : []),
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
      // we have to wrap the appName string in another string because of how define plugin explodes strings
      CRC_APP_NAME: JSON.stringify(appName),
      ...definePlugin,
    }),
    new ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    ...(hasTsConfig ? [new ForkTsCheckerWebpackPlugin()] : []),
    ...(plugins || []),
    ...(internalHotReload ? [new ReactRefreshWebpackPlugin()] : []),
    //     ...(useProxy && !localChrome
    //       ? [
    //           new (require('html-webpack-plugin'))({
    //             title: 'Chrome',
    //             filename: 'index.html',
    //             templateContent: async () => {
    //               // TODO this should maybe be solved differently
    //               // Maybe a mapper to match clouddotEnv + uiEnv to the approriate branch.
    //               const chromeEnv = (useDevBuild ? (env?.includes('-beta') ? 'dev-beta' : 'dev-stable') : env)?.replace('stage-', 'qa-');
    //               const chromeIndexUrl = chromeIndexHtmlUrl(chromeEnv);
    //
    //               fecLogger(LogType.info, 'Fetching chrome dist/index.html from ' + chromeIndexUrl);
    //               return (await fetch(chromeIndexUrl)).text();
    //             },
    //           }),
    //         ]
    //       : []),
  ];
};

export default createPlugins;
module.exports = createPlugins;
