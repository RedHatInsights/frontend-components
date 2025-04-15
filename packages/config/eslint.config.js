const { defineConfig } = require('eslint/config')
const fecConfig = require('../../eslint.config')

module.exports = defineConfig(fecConfig, {
  ignores: ["!**/*", "**/*.yaml"],
  "rules": {
    "@typescript-eslint/no-var-requires": "off"
  }
})
