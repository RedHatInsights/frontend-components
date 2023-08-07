const { defineConfig } = require('cypress')

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
    }
  }
})
