const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
const { env } = require('process');
rulesDirPlugin.RULES_DIR = path.resolve(__dirname, './packages/eslint-config/lib/rules');

module.exports = {
  root: true,
  ignorePatterns: ['**/*', '!.eslintrc.js'],
  plugins: ['@nx', 'prettier'],
  extends: ['plugin:prettier/recommended', 'plugin:json/recommended', path.resolve(__dirname, './packages/eslint-config/index.js')],
  globals: {
    insights: 'readonly',
  },
  overrides: [
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
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['plugin:@nx/typescript'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-prototype-builtins': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: ['*.js', '*.jsx'],
      extends: ['plugin:@nx/javascript'],
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
      extends: ['plugin:cypress/recommended'],
    },
  ],
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
    'rulesdir/forbid-pf-relative-imports': 1,
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
