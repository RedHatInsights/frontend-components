const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.resolve(__dirname, './packages/eslint-config/lib/rules');

module.exports = {
    plugins: [
        'rulesdir'
    ],
    extends: path.resolve(__dirname, './config/.eslintrc.yml'),
    overrides: [{
        files: [ 'packages/**/src/**/*.ts', 'packages/**/src/**/*.tsx' ],
        parser: '@typescript-eslint/parser',
        plugins: [ '@typescript-eslint' ],
        extends: [
            'plugin:@typescript-eslint/recommended'
        ],
        rules: {
            'no-use-before-define': 'off',
            '@typescript-eslint/no-use-before-define': [ 'error' ],
            'react/prop-types': 'off'
        }
    }]
};
