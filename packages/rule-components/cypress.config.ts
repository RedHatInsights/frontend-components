import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nx/react/plugins/component-testing';
import webpackConfig from '../../cypress.webpack.config';

const preset = nxComponentTestingPreset(__filename, { bundler: 'webpack' });

export default defineConfig({
  component: {
    ...preset,
    specPattern: 'cypress/**/*.cy.jsx',
    supportFile: false,
    devServer: { ...preset.devServer, webpackConfig },
  },
});
