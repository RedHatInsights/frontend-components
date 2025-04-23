const globals = require('globals');
const { defineConfig } = require('eslint/config');
const reactPlugin = require('eslint-plugin-react');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const babelParser = require('@babel/eslint-parser');
const path = require('path');
rulesDirPlugin.RULES_DIR = path.resolve(__dirname, './lib/rules');

// fix bad global names
const patchedBrowserGlobals = {
  ...globals.browser,
};
// Fixes issues with version mismatch between eslint-plugin-react and eslint
// https://github.com/sindresorhus/globals/pull/184
delete patchedBrowserGlobals['AudioWorkletGlobalScope '];
patchedBrowserGlobals['AudioWorkletGlobalScope'] = 'readonly';

module.exports = defineConfig(eslintPluginPrettierRecommended, reactPlugin.configs.flat.recommended, {
  plugins: {
    rulesdir: rulesDirPlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'prettier/prettier': ['error', { singleQuote: true }],
    'rulesdir/disallow-fec-relative-imports': 2,
    'rulesdir/deprecated-packages': 1,
    'rulesdir/no-chrome-api-call-from-window': 2,
    'rulesdir/disallow-pf-migrated-components': 1,
  },
  languageOptions: {
    globals: {
      ...patchedBrowserGlobals,
      ...globals.node,
      ...globals.jasmine,
      ...globals.jest,
      ...globals.es6,
      CRC_APP_NAME: 'readonly',
    },
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
      ecmaVersion: 7,
      sourceType: 'module',
      babelOptions: {
        presets: ['@babel/preset-react'],
      },
    },
  },
});
