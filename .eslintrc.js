const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = 'packages/eslint-config/lib/rules';

module.exports = {
  plugins: [
    'rulesdir'
  ],
  extends: './config/.eslintrc.yml'
}
