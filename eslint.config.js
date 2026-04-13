const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.resolve(__dirname, './packages/eslint-config/lib/rules');
const prettierPlugin = require('eslint-plugin-prettier');
const nxPlugin = require('@nx/eslint-plugin');
const { defineConfig } = require('eslint/config');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const jsonPlugin = require('eslint-plugin-json');
const fecPlugin = require('./packages/eslint-config/index')

const basePlugins = {
  rulesdir: rulesDirPlugin,
  prettier: prettierPlugin,
  '@nx': nxPlugin,
  '@typescript-eslint': tsPlugin,
  'typescript-eslint': tsPlugin,
  react: reactPlugin,
};

module.exports.basePlugins = basePlugins;

module.exports = defineConfig(
  eslintPluginPrettierRecommended,
  reactPlugin.configs.flat.recommended,
  fecPlugin,
  {
    ignores: [
      'src/demoData',
      'doc/',
      'node_modules/',
      'packages/*/**/*.js',
      '!packages/eslint-config/**/*.js',
      '!packages/config/*.js',
      '!packages/docs/**/*.js',
      '!packages/*/src/**/*.js',
      'src/SmartComponents/SamplePage/',
      'node_modules',
      '**/*',
      '!eslint.config.js',
    ],
    plugins: {
      rulesdir: rulesDirPlugin,
      prettier: prettierPlugin,
      '@nx': nxPlugin,
      '@typescript-eslint': tsPlugin,
      'typescript-eslint': tsPlugin,
      react: reactPlugin,
      json: jsonPlugin,
    },
    extends: ['json/recommended'],
    languageOptions: {
      globals: {
        insights: 'readonly',
      },
    },
    rules: {
      '@nx/dependency-checks': 'off',
      'no-prototype-builtins': 'off',
      'sort-imports': [
        2,
        {
          ignoreDeclarationSort: true,
        },
      ],
      'react/no-unknown-property': ['error', { ignore: ['widget-type', 'widget-id', 'page-type', 'ouiaId'] }],
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],
      'react/prop-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
  },
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-prototype-builtins': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  {
    files: ['*.js', '*.jsx'],
    rules: {
      'no-prototype-builtins': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['*.spec.ts', '*.spec.tsx', '*.spec.js', '*.spec.jsx', '*.test.ts', '*.test.tsx', '*.test.js', '*.test.jsx'],
    env: {
      jest: true,
    },
    rules: {},
  },
  {
    files: ['*.ct.js', '*.ct.jsx', '*.ct.ts', '*.ct.tsx', '*.cy.js', '*.cy.jsx', '*.cy.ts', '*.cy.tsx'],
    plugins: {
      cypress: require('eslint-plugin-cypress'),
    },
  },
);
