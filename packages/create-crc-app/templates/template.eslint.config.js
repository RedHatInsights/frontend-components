const { defineConfig } = require('eslint/config');
const fecConfig = require('@redhat-cloud-services/eslint-config-redhat-cloud-services');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');

module.exports = defineConfig(
  fecConfig,
  {
    languageOptions: {
      globals: {
        insights: 'readonly',
        shallow: 'readonly',
        render: 'readonly',
        mount: 'readonly',
      },
    },
    rules: {
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
        },
      ],
    },
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    parser: '@typescript-eslint/parser',
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    extends: ['@typescript-eslint/recommended'],
    rules: {
      'react/prop-types': 'off',
    },
  },
);
