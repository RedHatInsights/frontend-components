const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import searchIgnoredStyles from '@redhat-cloud-services/frontend-components-config-utilities/search-ignored-styles';

import { LogType, ProxyOptions, fecLogger, proxy } from '@redhat-cloud-services/frontend-components-config-utilities';
import addPrefixToContent from './addPrefixToContent';
type Configuration = import('webpack').Configuration;
type CacheOptions = import('webpack').FileCacheOptions | import('webpack').MemoryCacheOptions;
type ProxyConfigArrayItem = import('webpack-dev-server').ProxyConfigArrayItem;
type ClientConfiguration = import('webpack-dev-server').ClientConfiguration;
type ResolveOptions = import('webpack').ResolveOptions;

export interface CommonConfigOptions {
  rootFolder: string;
  appName: string;
  /** @deprecated use hotReload config instead */
  _unstableHotReload?: boolean;
  hotReload?: boolean;
  useFileHash?: boolean;
}
export type FrontendEnv = 'stage-stable' | 'prod-stable' | 'dev-stable';
export interface CreateConfigOptions extends CommonConfigOptions {
  port?: number;
  publicPath?: 'auto';
  cdnPath: string;
  appEntry: string;
  https?: boolean;
  mode?: Configuration['mode'];
  env?: FrontendEnv;
  sassPrefix?: string;
  useProxy?: boolean;
  proxyURL?: string;
  localChrome?: string;
  keycloakUri?: string;
  customProxy?: ProxyConfigArrayItem[];
  routes?: { [path: string]: ProxyConfigArrayItem };
  routesPath?: string;
  isProd?: boolean;
  standalone?: boolean;
  reposDir?: string;
  appUrl?: (string | RegExp)[];
  proxyVerbose?: boolean;
  target?: string;
  registry?: ProxyOptions['registry'];
  client?: ClientConfiguration;
  bundlePfModules?: boolean;
  bounceProd?: ProxyOptions['bounceProd'];
  useAgent?: boolean;
  useDevBuild?: boolean;
  useCache?: boolean;
  cacheConfig?: Partial<CacheOptions>;
  nodeModulesDirectories?: string[];
  resolve?: ResolveOptions;
  stripAllPfStyles?: boolean;
  blockLegacyChrome?: boolean;
  devtool?: Configuration['devtool'];
  _unstableSpdy?: boolean;
  frontendCRDPath?: string;
  deploymentBuild?: boolean;
}

export const createConfig = ({
  port,
  cdnPath,
  publicPath,
  appEntry,
  rootFolder,
  https,
  mode,
  appName,
  useFileHash = true,
  env,
  sassPrefix,
  useProxy,
  proxyURL,
  localChrome,
  keycloakUri,
  customProxy,
  routes,
  routesPath,
  isProd,
  standalone = false,
  reposDir,
  appUrl = [],
  proxyVerbose,
  target,
  registry,
  client = {
    overlay: false,
  },
  bundlePfModules = false,
  bounceProd,
  useAgent,
  useDevBuild = true,
  useCache = false,
  cacheConfig = {},
  _unstableHotReload,
  hotReload,
  resolve = {},
  // additional node_modules dirs for searchIgnoredStyles, usefull in monorepo scenario
  nodeModulesDirectories = [],
  stripAllPfStyles = false,
  blockLegacyChrome,
  devtool = false,
  // enables SPDY as a dev server
  _unstableSpdy = false,
  frontendCRDPath = path.resolve(rootFolder, 'deploy/frontend.yaml'),
  deploymentBuild = false,
}: CreateConfigOptions): Configuration => {
  if (typeof _unstableHotReload !== 'undefined') {
    fecLogger(LogType.warn, `The _unstableHotReload option in shared webpack config is deprecated. Use hotReload config instead.`);
  }
  const internalHotReload = !!(typeof hotReload !== 'undefined' ? hotReload : _unstableHotReload);
  const filenameMask = `js/[name].${!internalHotReload && useFileHash ? `[contenthash].` : ''}js`;

  const outputPath = `${rootFolder || ''}/dist`;

  const devServerPort = typeof port === 'number' ? port : useProxy || standalone ? 1337 : 8002;
  return {
    mode: mode || (isProd ? 'production' : 'development'),
    devtool: devtool,
    ...(useCache
      ? {
          cache: {
            type: 'filesystem',
            buildDependencies: {
              config: [__filename],
            },
            cacheDirectory: path.resolve(rootFolder, '.cache'),
            ...cacheConfig,
          },
        }
      : {}),
    entry: internalHotReload
      ? {
          main: appEntry,
          vendors: ['react', 'react-dom', 'react-refresh/runtime'],
        }
      : {
          App: appEntry,
        },
    output: {
      filename: filenameMask,
      path: outputPath,
      publicPath: publicPath === 'auto' ? publicPath : cdnPath,
      chunkFilename: filenameMask,
    },
    ...(internalHotReload
      ? {
          optimization: {
            // for HMR all runtime chunks must be in a single file
            runtimeChunk: 'single',
            removeEmptyChunks: true,
          },
        }
      : {}),
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: {
            // This TS loader is used here to apply the transform imports plugin
            loader: 'ts-loader',
            /** @type import("ts-loader/dist/interfaces").LoaderOptions */
            options: {
              transpileOnly: true,
              compilerOptions: {
                plugins: [
                  {
                    transform: '@redhat-cloud-services/tsc-transform-imports',
                    type: 'raw',
                  },
                ],
              },
            },
          },
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              /**
               * Second sass loader used for scoping the css with class name.
               * Has to be included as second in order to re-scope already compiled sass files.
               * Second loader is required to avoid scoping mixins, includes and other sass partials. We want to only scope the CSS output.
               */
              loader: 'sass-loader',
              options: {
                additionalData: function (
                  content: string,
                  loaderContext: {
                    resourcePath: string;
                    rootContext: string;
                  }
                ) {
                  const { resourcePath, rootContext } = loaderContext;
                  if (stripAllPfStyles && resourcePath.includes('node_modules') && resourcePath.includes('@patternfly/react-styles')) {
                    // hard remove PF styles from nested node_modules
                    // this fixes issues with apps having a significant number of PF version installed from transitive dependencies
                    return '';
                  }
                  const relativePath = path.relative(rootContext, resourcePath);
                  /**
                   * Add app class context for local style files.
                   * Context class is equal to app name and that class ass added to root element via the chrome-render-loader.
                   */

                  if (relativePath.match(/^src/)) {
                    const transformedContent = addPrefixToContent(content, sassPrefix ?? `.${appName}`);
                    return transformedContent;
                  }

                  return content;
                },
                sassOptions: {
                  silenceDeprecations: ['legacy-js-api'],
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  silenceDeprecations: ['legacy-js-api'],
                },
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]',
          },
        },
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      ...resolve,
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.scss', ...(resolve.extensions || [])],
      alias: {
        ...(bundlePfModules
          ? {}
          : searchIgnoredStyles(rootFolder, ...(Array.isArray(nodeModulesDirectories) ? nodeModulesDirectories : [nodeModulesDirectories]))),
        ...resolve.alias,
      },
      fallback: {
        path: require.resolve('path-browserify'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
        assert: require.resolve('assert/'),
        buffer: require.resolve('buffer/'),
        url: require.resolve('url/'),
        util: require.resolve('util/'),
        process: 'process/browser.js',
        ...resolve.fallback,
      },
    },
    ...(!deploymentBuild && {
      devServer: {
        static: {
          directory: `${rootFolder || ''}/dist`,
        },
        port: devServerPort,
        server: _unstableSpdy ? 'spdy' : https || Boolean(useProxy) ? 'https' : 'http',
        host: '0.0.0.0', // This shares on local network. Needed for docker.host.internal
        hot: internalHotReload, // Use livereload instead of HMR which is spotty with federated modules
        liveReload: !internalHotReload,
        allowedHosts: 'all',
        // https://github.com/bripkens/connect-history-api-fallback
        historyApiFallback: {
          // We should really implement the same logic as cloud-services-config
          //
          // Until then let known api calls fall through instead of returning /index.html
          // for easier `fetch` debugging
          rewrites: [
            { from: /^\/api/, to: '/404.html' },
            { from: /^\/config/, to: '/404.html' },
          ],
          verbose: Boolean(proxyVerbose),
          disableDotRule: true,
        },
        devMiddleware: {
          writeToDisk: true,
          publicPath: cdnPath,
        },
        client,
        ...proxy({
          env,
          localChrome,
          keycloakUri,
          customProxy,
          routes,
          routesPath,
          useProxy,
          proxyURL,
          standalone,
          port: devServerPort,
          reposDir,
          appUrl,
          publicPath: cdnPath,
          proxyVerbose,
          target,
          registry,
          bounceProd,
          useAgent,
          useDevBuild,
          blockLegacyChrome,
          frontendCRDPath,
        }),
      },
    }),
  };
};

export default createConfig;
module.exports = createConfig;
