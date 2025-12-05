// @ts-nocheck
import path from 'path';
import { createJoinFunction, createJoinImplementation, asGenerator, defaultJoinGenerator } from 'resolve-url-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { glob } from 'glob';
import { readFileSync } from 'fs';

function importVariants(url: string) {
  const parsedUrl = path.parse(url);
  let variants = [url];
  if (parsedUrl.dir && !parsedUrl.ext) {
    const moduleName = url.split('/').pop();
    variants = [`${url.replace(new RegExp(`${moduleName}$`), `_${moduleName}`)}.scss`, `${url}.scss`];
  }

  return variants;
}

// call default generator then pair different variations of uri with each base
const myGenerator = asGenerator((item: unknown, ...rest) => {
  const defaultTuples = [...defaultJoinGenerator(item, ...rest)];
  if (item.uri.includes('./assets')) {
    return defaultTuples.map(([base]) => {
      if (base.includes('@patternfly/patternfly')) {
        return [base, path.relative(base, path.resolve(__dirname, './node_modules/@patternfly/patternfly', item.uri))];
      }
    });
  }
  return defaultTuples;
});

function localAliasHoisting() {
  // Since this config file is at project root, __dirname gives us the project root
  // This is more reliable than process.cwd() which depends on where the command was run
  const projectRoot = __dirname;
  const packagesPattern = path.resolve(projectRoot, 'packages/*');
  const localPackages = glob.sync(packagesPattern).reduce((acc, curr) => {
    const pck = JSON.parse(readFileSync(path.resolve(curr, 'package.json'), 'utf-8'));
    acc[pck.name] = curr + '/src';
    return acc
  }, {});
  return localPackages;
}

const localPackages = localAliasHoisting();


export default {
  devtool: 'inline-source-map',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
              },
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
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
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              webpackImporter: false,
              api: "modern",
              sassOptions: {
                includePaths: [...glob.sync(path.resolve(__dirname, './packages/*/src')), path.resolve(__dirname, './node_modules')],
                importers: [{
                  findFileUrl(url: string) {
                    let variants: string[] = []
                    let sassPath: string;
                    if (url.startsWith('~@redhat-cloud-services')) {

                      const repoPackage = url.split('~').pop();
                      const segments = repoPackage.split('/');
                      const sourcePackage = localPackages[`${segments[0]}/${segments[1]}`];
                      if(sourcePackage) {
                        // resolve local packages to src directory
                        const pathSegments = segments.slice(2);
                        return new URL(`file://${path.resolve(sourcePackage, ...pathSegments)}`);
                      }
                    }

                    if(url.startsWith('~')) {
                      const localPackage = path.resolve(process.cwd(), './node_modules/', url.split('~').pop());
                      variants = importVariants(localPackage);
                      sassPath = variants.find((v) => glob.sync(v).length);
                      if(sassPath) {
                        return new URL(`file://${sassPath}`);
                      }
                      const globalPackage = path.resolve(__dirname, './node_modules/', url.split('~').pop());
                      variants = importVariants(globalPackage);
                      sassPath = variants.find((v) => glob.sync(v).length);
                      if(sassPath) {
                        return new URL(`file://${sassPath}`);
                      }
                    }
                    return new URL(url);
                  }
                }]
              }
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|svg|png|gif|ico|eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      // make sure the runner hoists the local packages, not the build packages
      ...localPackages,
    },
  },
  output: {
    filename: 'bundle.js',
    hashFunction: 'xxhash64',
    path: path.resolve(__dirname, 'dist'),
  },
  stats: {
    errorDetails: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      ignoreOrder: true,
    }),
  ]
};
