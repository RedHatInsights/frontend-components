module.exports = {
    parser: '@babel/eslint-parser',
    env: {
        browser: true,
        node: true,
        es6: true,
        jasmine: true,
        jest: true
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    plugins: [
        'prettier'
    ],
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'prettier/react'
    ],
    rules: {
        'no-unused-vars': [
            'error',
            { ignoreRestSiblings: true }
        ],
        'prettier/prettier': [
            'error',
            { singleQuote: true }
        ]
    },
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module'
    }
};
