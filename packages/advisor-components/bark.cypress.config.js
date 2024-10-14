const { defineConfig } = require('cypress')
const { addMatchImageSnapshotPlugin } = require('@simonsmith/cypress-image-snapshot/plugin');

/** @type {import('cypress').defineConfig} */
module.exports = defineConfig({
  component: {
    specPattern: "src/**/*.spec.ct.{js,ts,jsx,tsx}",
    viewportHeight: 660,
    viewportWidth: 1000,
    video: false,
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: require('./cypress/cypress.webpack.config')
    },
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--window-size=1280,720');

          // force screen to be non-retina
          launchOptions.args.push('--force-device-scale-factor=1');
        }

        if (browser.name === 'electron' && browser.isHeadless) {
          // fullPage screenshot size is 1280x720
          launchOptions.preferences.width = 1280;
          launchOptions.preferences.height = 720;
        }
      });
    },
  }
})
