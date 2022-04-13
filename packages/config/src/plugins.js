const { SourceMapDevToolPlugin } = require('webpack');
const { ProvidePlugin, DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const ChunkMapperPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/chunk-mapper');
const jsVarName = require('@redhat-cloud-services/frontend-components-config-utilities/jsVarName');

module.exports = ({
  rootFolder,
  appDeployment,
  htmlPlugin,
  replacePlugin,
  insights,
  modules,
  generateSourceMaps,
  plugins,
  useChromeTemplate = false,
  definePlugin = {},
} = {}) => [
  ...(generateSourceMaps
    ? [
        new SourceMapDevToolPlugin({
          test: 'js',
          exclude: /(node_modules|bower_components)/i,
          filename: 'sourcemaps/[name].[contenthash].js.map',
        }),
      ]
    : []),
  new MiniCssExtractPlugin({
    chunkFilename: 'css/[name].[contenthash].css',
    filename: 'css/[name].[contenthash].css',
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
        new DefinePlugin({
          // we have to wrap the appname string in another string because of how define plugin explodes strings
          CRC_APP_NAME: JSON.stringify(insights?.appname),
          ...(definePlugin || {}),
        }),
      ]),
  new ProvidePlugin({
    process: 'process/browser.js',
    Buffer: ['buffer', 'Buffer'],
  }),
  new ChunkMapperPlugin({ modules: [...(insights ? [jsVarName(insights.appname)] : []), ...(modules || [])] }),
  ...(plugins || []),
];
