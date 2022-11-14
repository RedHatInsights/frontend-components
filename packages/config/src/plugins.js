const { SourceMapDevToolPlugin } = require('webpack');
const { ProvidePlugin, DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const ChunkMapperPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper');
const jsVarName = require('@redhat-cloud-services/frontend-components-config-utilities/jsVarName');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { glob } = require('glob');
const path = require('path');

module.exports = ({
  rootFolder,
  appDeployment,
  htmlPlugin,
  replacePlugin,
  insights,
  modules,
  generateSourceMaps,
  plugins,
  useChromeTemplate = true,
  definePlugin = {},
  _unstableHotReload = false,
  useFileHash = true,
} = {}) => {
  const hasTsConfig = glob.sync(path.resolve(rootFolder, './{tsconfig.json,!(node_modules)/**/tsconfig.json}')).length > 0;
  const fileHash = !_unstableHotReload && useFileHash;
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
      cleanOnceBeforeBuildPatterns: useChromeTemplate ? ['**/*', '!index.html'] : ['**/*'],
    }),
    ...(useChromeTemplate
      ? []
      : [
          new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'index.html',
            template: `${rootFolder || ''}/src/index.html`,
            inject: false,
            ...(htmlPlugin || {}),
          }),
          new HtmlReplaceWebpackPlugin([
            {
              pattern: '@@env',
              replacement: appDeployment || '',
            },
            ...(replacePlugin || []),
          ]),
        ]),
    new DefinePlugin({
      // we have to wrap the appname string in another string because of how define plugin explodes strings
      CRC_APP_NAME: JSON.stringify(insights?.appname),
      ...(definePlugin || {}),
    }),
    new ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    new ChunkMapperPlugin({ _unstableHotReload, modules: [...(insights ? [jsVarName(insights.appname)] : []), ...(modules || [])] }),
    ...(hasTsConfig ? [new ForkTsCheckerWebpackPlugin()] : []),
    ...(plugins || []),
    ...(_unstableHotReload ? [new ReactRefreshWebpackPlugin()] : []),
  ];
};
