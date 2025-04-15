const { defineConfig } = require("eslint/config");
const nxPlugin = require('@nx/eslint-plugin');
const fecConfig = require('../../eslint.config');
const tsPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig(
  // fecConfig,
  {
  plugins: {
    '@nx': nxPlugin,
    'typescript-eslint': tsPlugin,
  },
  // "extends": ["@nx/react"],
  ignores: ["!**/*"],
}
// {
//   "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
//   "rules": {}
// },
// {
//   "files": ["*.ts", "*.tsx"],
//   "rules": {}
// },
// {
//   "files": ["*.js", "*.jsx"],
//   "rules": {}
// }
)
