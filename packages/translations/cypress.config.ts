import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nx/react/plugins/component-testing';
import { NormalModuleReplacementPlugin } from 'webpack';
import path from 'path';
import webpackConfig from '../../cypress.webpack.config';

const preset = nxComponentTestingPreset(__filename, { bundler: 'webpack' });

export default defineConfig({
  component: {
    ...preset,
    specPattern: 'cypress/**/*.cy.jsx',
    supportFile: false,
    devServer: {
      ...preset.devServer,
      webpackConfig: {
        ...webpackConfig,
        plugins: [
          ...webpackConfig.plugins,
          // Control catalog delivery without adding synthetic production locale files.
          new NormalModuleReplacementPlugin(/\/loadMessages$/, (resource) => {
            if (resource.context.startsWith(path.join(__dirname, 'src'))) {
              resource.request = path.join(__dirname, 'cypress/fixtures/loadMessages.js');
            }
          }),
        ],
      },
    },
  },
});
