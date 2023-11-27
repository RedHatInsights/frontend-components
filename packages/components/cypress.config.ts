const { defineConfig } = require('cypress');
const path = require('path');

/** @type {import('cypress').defineConfig} */
module.exports = defineConfig({
  reporter: path.resolve(__dirname, "../../node_modules/mocha-ibutsu-reporter"),
  reporterOptions: {
    project: "insights-qe",
    component: "frontend-components",
    outputDir: path.resolve(__dirname, "../../ibutsu-report")
  },
  component: {
    specPattern: 'src/**/*.spec.ct.{js,ts,jsx,tsx}',
    viewportHeight: 660,
    viewportWidth: 1000,
    video: false,
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig: require('./cypress/cypress.webpack.config'),
    },
  },
});
