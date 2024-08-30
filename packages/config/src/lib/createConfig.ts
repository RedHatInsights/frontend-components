const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const searchIgnoredStyles = require('@redhat-cloud-services/frontend-components-config-utilities/search-ignored-styles');

// TODO TBH. to me the split between config and config-utils feels unneccessary
// for example, isn't createConfig.ts a config-util...? it helps creating a config, but it's not a config itself.
// Maybe we should just jug everything into the config package?
import { ProxyOptions, fecWebpackLogger, proxy } from '@redhat-cloud-services/frontend-components-config-utilities';
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
  env?: FrontendEnv;
}
export type FrontendEnv = 'stage-stable' | 'prod-stable';
export interface CreateConfigOptions extends CommonConfigOptions {
  port?: number;
  publicPath: string;
  appEntry: string;
  https?: boolean;
  mode?: Configuration['mode'];
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
  appUrl?: string | (string | RegExp)[];
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
  localApps?: string;
  localApis?: string;
  skipProxyCheck?: boolean;
  debug?: boolean;
  outputConfigs?: boolean;
}

export const createConfig = ({
  port,
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
  resolve = {},
  // additional node_modules dirs for searchIgnoredStyles, usefull in monorepo scenario
  nodeModulesDirectories = [],
  stripAllPfStyles = false,
  blockLegacyChrome,
  localApps,
  localApis,
  skipProxyCheck,
}: CreateConfigOptions): Configuration => {
  const filenameMask = `js/[name].${useFileHash ? `[contenthash].` : ''}js`;

  const outputPath = `${rootFolder || ''}/dist`;

  const devServerPort = typeof port === 'number' ? port : useProxy || standalone ? 1337 : 8002;
  return {
    // TODO This and maybe the config building as a whole could be broken up better
    // I was thinking to break them out into modules for each prop,
    // like ./webpack/modules.ts, which only contains config related to that.
    mode: mode || (isProd ? 'production' : 'development'),
    ...(isProd ? { devtool: false } : {}),
    infrastructureLogging: {
      colors: true,
      console: fecWebpackLogger(),
    },
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
    entry: {
      App: appEntry,
    },
    output: {
      filename: filenameMask,
      path: outputPath,
      publicPath,
      chunkFilename: filenameMask,
    },
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
              },
            },
            'sass-loader',
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
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.scss', ...(resolve.extensions, [])],
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
    devServer: {
      static: {
        directory: `${rootFolder || ''}/dist`,
      },
      port: devServerPort,
      // TODO deprecated and should be replaced with `server` when fully moving to webpack(devserver) v5
      server: 'https',
      host: '0.0.0.0', // This shares on local network. Needed for docker.host.internal
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
      // devMiddleware: {
      //   // TODO Figure out if this helps in any way or if it is required for something
      //   writeToDisk: true,
      // },
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
        publicPath,
        proxyVerbose,
        target,
        registry,
        bounceProd,
        useAgent,
        useDevBuild,
        blockLegacyChrome,
        localApps,
        localApis,
        skipProxyCheck,
      }),
    },
  };
};

export default createConfig;
module.exports = createConfig;
