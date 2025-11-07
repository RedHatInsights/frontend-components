import { LogType, fecLogger } from '@redhat-cloud-services/frontend-components-config-utilities';
import webpack, { Compiler, DefinePlugin, ProvidePlugin, WebpackPluginInstance } from 'webpack';
import { CommonConfigOptions } from './createConfig';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');
const { glob } = require('glob');
const path = require('path');

export type WebpackPluginDefinition = undefined | null | false | '' | 0 | ((this: Compiler, compiler: Compiler) => void) | WebpackPluginInstance;

export interface SentryConfig {
  org: string;
  project: string;
  release?: string;
  urlPrefix?: string;
  include?: string;
  ignore?: string[];
  inject?: boolean;
  cleanArtifacts?: boolean;
  rewrite?: boolean;
}

export interface CreatePluginsOptions extends CommonConfigOptions {
  generateSourceMaps?: boolean;
  plugins?: WebpackPluginDefinition[];
  definePlugin?: Record<string, any>;
  initSentry?: SentryConfig;
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
  initSentry,
}: CreatePluginsOptions) => {
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
    ...(generateSourceMaps
      ? [
          new webpack.SourceMapDevToolPlugin({
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
    // Put the sentry plugin at the end of the plugins array
    ...(process.env.ENABLE_SENTRY && initSentry
      ? [
          sentryWebpackPlugin({
            ...(process.env.SENTRY_AUTH_TOKEN && {
              authToken: process.env.SENTRY_AUTH_TOKEN,
            }),
            org: initSentry.org,
            project: initSentry.project,
            release: process.env.SENTRY_RELEASE,
            urlPrefix: initSentry.urlPrefix,
            include: initSentry.include,
            ignore: initSentry.ignore,
            inject: initSentry.inject,
            cleanArtifacts: initSentry.cleanArtifacts ,
            rewrite: initSentry.rewrite ,
            moduleMetadata: ({ release }: { release: string }) => ({
              dsn: process.env.SENTRY_DSN,
              org: initSentry.org,
              project: initSentry.project,
              release,
            }),
          }),
        ]
      : []),
  ];
};

export default createPlugins;
module.exports = createPlugins;
