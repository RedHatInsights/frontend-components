import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import { readFileSync, existsSync } from 'fs';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, '../../..');

function localAliasHoisting() {
  return globSync(path.resolve(rootDir, 'packages/*')).reduce<Record<string, string>>((acc, curr) => {
    const pkgPath = path.resolve(curr, 'package.json');
    if (!existsSync(pkgPath)) return acc;
    const pck = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    acc[pck.name] = curr + '/src';
    return acc;
  }, {});
}

const localPackages = localAliasHoisting();

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function importVariants(url: string) {
  const parsedUrl = path.parse(url);
  if (parsedUrl.dir && !parsedUrl.ext) {
    const moduleName = url.split('/').pop()!;
    return [`${url.replace(new RegExp(`${escapeRegExp(moduleName)}$`), `_${moduleName}`)}.scss`, `${url}.scss`];
  }
  return [url];
}

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-webpack5-compiler-swc'],
  framework: '@storybook/react-webpack5',
  webpackFinal: async (config) => {
    config.module?.rules?.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            api: 'modern',
            sassOptions: {
              includePaths: [...globSync(path.resolve(rootDir, './packages/*/src')), path.resolve(rootDir, './node_modules')],
              importers: [
                {
                  findFileUrl(url: string) {
                    if (url.startsWith('~@redhat-cloud-services')) {
                      const repoPackage = url.split('~').pop()!;
                      const segments = repoPackage.split('/');
                      const sourcePackage = localPackages[`${segments[0]}/${segments[1]}`];
                      if (sourcePackage) {
                        return new URL(`file://${path.resolve(sourcePackage, ...segments.slice(2))}`);
                      }
                    }

                    if (url.startsWith('~')) {
                      const stripped = url.split('~').pop()!;
                      const localPath = path.resolve(rootDir, './node_modules/', stripped);
                      const variants = importVariants(localPath);
                      const found = variants.find((v) => globSync(v).length);
                      if (found) {
                        return new URL(`file://${found}`);
                      }
                    }

                    return null;
                  },
                },
              ],
            },
          },
        },
      ],
    });

    config.resolve = {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        ...localPackages,
      },
    };

    return config;
  },
};

export default config;
