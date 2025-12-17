const path = require('path');
const { createScssWorkspaceImporter } = require('../executors/dist/executors/build-styles/scss-workspace-importer');

/**
 * Custom webpack plugin to add SCSS workspace importer for development.
 *
 * NOTE: This is ONLY for the demo app as an internal development tool.
 * External consumer apps should NOT use this approach - they use published
 * packages where standard sass-loader resolution works fine.
 *
 * This enables real-time FEC development workflow with workspace packages.
 */
class SassLoaderWorkspaceImporterPlugin {
  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('SassLoaderWorkspaceImporterPlugin', () => {
      const rules = compiler.options.module.rules;
      const workspaceImporter = createScssWorkspaceImporter(path.resolve(__dirname, '../..'));

      rules.forEach(rule => {
        if (rule.use && Array.isArray(rule.use)) {
          rule.use.forEach(loader => {
            if (typeof loader === 'object' && loader.loader === 'sass-loader') {
              loader.options = loader.options || {};
              loader.options.sassOptions = loader.options.sassOptions || {};
              loader.options.sassOptions.importers = [workspaceImporter];
            }
          });
        }
      });
    });
  }
}

module.exports = {
  // REQUIRED: App URL routing configuration
  appUrl: '/staging/demo',

  // REQUIRED: Module Federation configuration (FEC mandates this)
  moduleFederation: {
    exposes: {
      './RootApp': './src/entry.tsx',
    },
    shared: {
      'react': { singleton: true, requiredVersion: '18.3.1' },
      'react-dom': { singleton: true, requiredVersion: '18.3.1' },
    },
  },

  // Development features
  debug: true,
  useProxy: true,
  proxyVerbose: true,

  // Hot Module Replacement (HMR) - optional
  hotReload: process.env.HOT === 'true',

  // Custom webpack plugins - Add SCSS workspace importer for workspace development
  plugins: [
    new SassLoaderWorkspaceImporterPlugin()
  ],

  // Chrome configuration interception (for local dev)
  interceptChromeConfig: false,

  // Custom routes (if needed for API mocking)
  routes: {
    // Example: '/api': { host: 'http://localhost:8080' }
  },
};

