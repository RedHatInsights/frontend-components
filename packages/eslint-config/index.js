module.exports = {
    parser: 'babel-eslint',
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
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module'
    }
};
