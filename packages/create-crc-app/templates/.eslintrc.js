module.exports = {
  extends: '@redhat-cloud-services/eslint-config-redhat-cloud-services',
  globals: {
    insights: 'readonly',
    shallow: 'readonly',
    render: 'readonly',
    mount: 'readonly',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
  },
};
