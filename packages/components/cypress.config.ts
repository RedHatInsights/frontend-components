import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nx/react/plugins/component-testing';
import webpackConfig from '../../cypress.webpack.config';

const presets = nxComponentTestingPreset(__filename, {
  bundler: 'webpack',
});

export default defineConfig({
  component: {
    ...presets,
    specPattern: 'cypress/**/*.cy.{js,jsx,ts,tsx}',
    devServer: {
      ...presets.devServer,
      webpackConfig,
    },
  }
});
