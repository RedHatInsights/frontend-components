const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const searchIgnoredStyles = require('@redhat-cloud-services/frontend-components-config-utilities/search-ignored-styles');

import { LogType, ProxyOptions, fecLogger, proxy } from '@redhat-cloud-services/frontend-components-config-utilities';
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
export type FrontendEnv = 'stage-stable' | 'prod-stable' | 'ci-stable' | 'qa-stable' | 'stage-beta' | 'prod-beta' | 'ci-beta' | 'qa-beta';
export interface CreateConfigOptions extends CommonConfigOptions {
  port?: number;
  publicPath: string;
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
  _unstableHotReload,
  hotReload,
  resolve = {},
  // additional node_modules dirs for searchIgnoredStyles, usefull in monorepo scenario
  nodeModulesDirectories = [],
}: CreateConfigOptions): Configuration => {
  if (typeof _unstableHotReload !== 'undefined') {
    fecLogger(LogType.warn, `The _unstableHotReload option in shared webpack config is deprecated. Use hotReload config instead.`);
  }
  const internalHotReload = !!(typeof hotReload !== 'undefined' ? hotReload : _unstableHotReload);
  const filenameMask = `js/[name].${!internalHotReload && useFileHash ? `[contenthash].` : ''}js`;

  const outputPath = `${rootFolder || ''}/dist`;

  const copyTemplate = (chromePath: string) => {
    const template = fs.readFileSync(`${chromePath}/index.html`, { encoding: 'utf-8' });
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(`${outputPath}/index.html`, template);
  };

  const addPrefixToContent = (content: string, sassPrefix: string | undefined, appName: string) : string => {
    const sassPrefixes = sassPrefix ? sassPrefix.split(',').map(prefix => prefix.trim()) :  [];

    // Helper function to check if a prefix should be prepended
    function shouldPrependPrefix(selector: string): boolean {
      for (let prefix of sassPrefixes) {
        const exactPrefix = new RegExp(`^${prefix}(\\s|\\{)`);
        if (exactPrefix.test(selector)) {
            return false;
        }
    }
    const exactAppNamePrefix = new RegExp(`^\\.${appName}(\\s|\\{)`);
    return !exactAppNamePrefix.test(selector);
    }

    // process the content
    const topLevelMatches = content.match(/([^\{]+)\s*\{([\s\S]*)\}/);
    if(!topLevelMatches) {
      return `${sassPrefix}{\n${content}\n}`;
    }

    const topLevelSelectors = topLevelMatches[1].trim().split(',').map(selector => selector.trim());
    const nestedContent = topLevelMatches[2].trim();

    const prefixedSelectors = topLevelSelectors.map(selector => {
      if(shouldPrependPrefix(selector)) {
        const prefixToUse = (sassPrefix && sassPrefix.length > 0) ? sassPrefixes[0] : `.${appName}`;
        return `${prefixToUse} ${selector}`;
      }
      return selector;
    });

    const finalContent = `${prefixedSelectors.join(', ')} {\n${nestedContent}}\n`;

    return finalContent;
  }


  const devServerPort = typeof port === 'number' ? port : useProxy || standalone ? 1337 : 8002;
  return {
    mode: mode || (isProd ? 'production' : 'development'),
    devtool: false,
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
      publicPath,
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
                  const relativePath = path.relative(rootContext, resourcePath);
                  /**
                   * sassPrefix = .learning-resources, .learningResources
                   * 
                   * learning-resources.scss
                   * 
                   * <div class="chr-scope__default-layout learningResources"></div>
                   * .learningResources {
                   *    positions: sticky;
                   * }
                   * 
                   * 
                   * Nested element
                   * <article class="pf-v5-c-card learning-card"></article>
                   * .pf-v5-c-card {
                   *    &.learning-card {
                   *      color: red;
                   *    }
                   * }
                   * 
                   * // current SCSS output
                   * 
                   * .learning-resources, .learningResources {
                   * 
                   *  .learningResources {
                   *    positions: sticky;
                   *  }
                   * .pf-v5-c-card {
                   *    &.learning-card {
                   *      color: red;
                   *    }
                   *  }                                  
                   * }
                   * 
                   * current CSS output
                   *   prefix                  selector             prefix             selector
                   * .learning-resources .learningResources, .learningResources .learningResources {
                   *   positions: sticky;
                   * }
                   *      prefix                       selector              prefix               selector
                   * .learning-resources .pf-v5-c-card.learning-card, .learningResources .pf-v5-c-card.learning-card {
                   *   blanbla
                   * }
                   * ____________________________________________________________________________________________________________
                   * // new SCSS output
                   * 
                   *   selector matches sassPrefix
                   * .learningResources {
                   *   positions: sticky;
                   * }
                   * 
                   * .learning-resources, .learningResources {
                   *  .pf-v5-c-card {
                   *    &.learning-card {
                   *      color: red;
                   *    }
                   *  }         
                   * }
                   * 
                   * // new CSS output
                   * 
                   *     selector (matches sassPrefix prefix)
                   * .learningResources {
                   *   positions: sticky;
                   * }
                   * 
                   *      prefix                       selector              prefix               selector
                   * .learning-resources .pf-v5-c-card.learning-card, .learningResources .pf-v5-c-card.learning-card {
                   *   blanbla
                   * }
                   */




                  /**
                   * Add app class context for local style files.
                   * Context class is equal to app name and that class ass added to root element via the chrome-render-loader.
                   */

                  console.log(`content before modification: ${content}`);

                  if (relativePath.match(/^src/)) {
                    const transformedContent = addPrefixToContent(content, sassPrefix, appName);
                    console.log(`Transformed content: ${transformedContent}`);
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
      https: https || Boolean(useProxy),
      host: '0.0.0.0', // This shares on local network. Needed for docker.host.internal
      hot: internalHotReload, // Use livereload instead of HMR which is spotty with federated modules
      liveReload: !internalHotReload,
      allowedHosts: 'all',
      // https://github.com/bripkens/connect-history-api-fallback
      historyApiFallback: {
        // We should really implement the same logic as cloud-services-config
        // and only redirect (/beta)?/bundle/app-name to /index.html
        //
        // Until then let known api calls fall through instead of returning /index.html
        // for easier `fetch` debugging
        rewrites: [
          { from: /^\/api/, to: '/404.html' },
          { from: /^(\/beta)?\/config/, to: '/404.html' },
        ],
        verbose: Boolean(proxyVerbose),
        disableDotRule: true,
      },
      devMiddleware: {
        writeToDisk: true,
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
        publicPath,
        proxyVerbose,
        target,
        registry,
        onBeforeSetupMiddleware: ({ chromePath }) => {
          if (chromePath) {
            copyTemplate(chromePath);
          }
        },
        bounceProd,
        useAgent,
        useDevBuild,
      }),
    },
  };
};

export default createConfig;
module.exports = createConfig;
