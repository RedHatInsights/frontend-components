import remarkGfm from 'remark-gfm';

import path from 'path';
import * as glob from 'glob';
import withTMConfig from 'next-transpile-modules';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withTM = withTMConfig([
  '@patternfly/react-core',
  '@patternfly/react-styles',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@redhat-cloud-services/frontend-components',
]);

/**
 * Function that searches for all patternfly styles in node_modules and outputs an webpack alias object to ignore found modules.
 * @param {string} root absolute directory path to root folder containig package.json
 * @returns {Object}
 */
const searchIgnoredStyles = (root) => {
  const ignoredPaths = [
    path.join(root, '../../node_modules/@patternfly/react-styles'),
    path.join(root, './node_modules/@patternfly/react-styles'),
    path.join(root, '../components'),
    path.join(root, './node_modules/@redhat-cloud-services/frontend-components'),
  ];

  let result = {};

  ignoredPaths.forEach((path) => {
    result = {
      ...result,
      ...glob.sync(`${path}/**/*.css`).reduce((acc, curr) => {
        if (curr.includes('@redhat-cloud-services/frontend-components/index.css')) {
          return acc;
        }
        return {
          ...acc,
          [curr]: false,
        };
      }, {}),
    };
  });

  return result;
};

export default withTM({
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    experimental: {
      esmExternals:true
    },
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        ...searchIgnoredStyles(process.cwd()),
        '@docs/example-component': path.resolve(__dirname, './components/example-component'),
        '@docs/examples': path.resolve(__dirname, './examples'),
        '@docs/deprecation-warn': path.resolve(__dirname, './components/deprecation-warn'),
        '@docs/extensive-prop': path.resolve(__dirname, './components/extensive-prop'),
        // react: path.resolve(__dirname, '../../node_modules/react'),
        // 'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
      };
      config.module.rules.push({
        test: /\.mdx?$/,
      use: [
        {
          loader: '@mdx-js/loader',
          options: {
            providerImportSource: '@mdx-js/react',
            remarkPlugins: [
              remarkGfm,
            ]
          }
        }
      ]
      })
      return config;
    },
  })

