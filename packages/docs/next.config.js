const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
});
const path = require('path');
const withTM = require('next-transpile-modules')([
  '@patternfly/react-core',
  '@patternfly/react-styles',
  '@patternfly/react-table',
  '@patternfly/react-icons',
  '@redhat-cloud-services/frontend-components',
]);

module.exports = withMDX(
  withTM({
    pageExtensions: ['js', 'jsx', 'md', 'mdx'],
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@docs/example-component': path.resolve(__dirname, './components/example-component'),
        '@docs/examples': path.resolve(__dirname, './examples'),
        '@docs/deprecation-warn': path.resolve(__dirname, './components/deprecation-warn'),
        '@docs/extensive-prop': path.resolve(__dirname, './components/extensive-prop'),
        react: path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      };
      return config;
    },
  })
);
