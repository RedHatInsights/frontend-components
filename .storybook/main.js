const custom = require('../packages/demo/webpack.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  "stories": [
    "../packages/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "core": {
    "builder": "webpack5"
  },
  "webpackFinal": (config) => {
    config.module.rules.push(...custom().module.rules);
    config.plugins.push(new MiniCssExtractPlugin({chunkFilename: '[name].css', filename: '[id].css'}));
    return config
  },
}
