module.exports = {
  // REQUIRED: App URL routing configuration
  appUrl: '/apps/demo',

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

  // Additional webpack plugins (if needed)
  plugins: [],

  // Chrome configuration interception (for local dev)
  interceptChromeConfig: false,

  // Custom routes (if needed for API mocking)
  routes: {
    // Example: '/api': { host: 'http://localhost:8080' }
  },
};

