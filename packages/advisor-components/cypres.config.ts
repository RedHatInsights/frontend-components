import { defineConfig } from 'cypress';
import path from 'path';
import { nxComponentTestingPreset } from '@nx/react/plugins/component-testing';
import webpackConfig from '../../cypress.webpack.config';
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin';

const presets = nxComponentTestingPreset(__filename, {
  bundler: 'webpack',
});

const updatedWebpackConfig = {
  ...webpackConfig,
};

updatedWebpackConfig.resolve.alias['@redhat-cloud-services/frontend-components/useChrome'] = path.resolve(__dirname, './cypress.overrideChrome.js');

export default defineConfig({
  component: {
    ...presets,
    specPattern: 'cypress/**/*.cy.{js,jsx,ts,tsx}',
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
    devServer: {
      ...presets.devServer,
      webpackConfig,
    },
  },
});
