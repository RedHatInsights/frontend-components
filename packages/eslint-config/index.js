const rulesDirPlugin = require('eslint-plugin-rulesdir');
const path = require('path');
rulesDirPlugin.RULES_DIR = path.resolve(__dirname, './lib/rules');

module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    node: true,
    es6: true,
    jasmine: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['prettier', 'rulesdir'],
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended', 'plugin:react/recommended'],
  rules: {
    'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'prettier/prettier': ['error', { singleQuote: true }],
    'rulesdir/disallow-fec-relative-imports': 2,
    'rulesdir/deprecated-packages': 1,
    'rulesdir/no-chrome-api-call-from-window': 2,
  },
  globals: {
    CRC_APP_NAME: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
  },
};
