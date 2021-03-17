const path = require('path');
const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.resolve(__dirname, './packages/eslint-config/lib/rules');

module.exports = {
    plugins: [
        'rulesdir'
    ],
    extends: path.resolve(__dirname, './config/.eslintrc.yml')
};
