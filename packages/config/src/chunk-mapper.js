/* global require, module */
const { resolve } = require('path');
const { writeFileSync, mkdirSync } = require('fs');

class ChunkMapper {
  config = {};
  constructor(options) {
      this.options = options || {};
  }

  apply(compiler) {
      compiler.hooks.emit.tap('ChunkMapper', (compilation) => {
          const prefix = this.options.prefix || RegExp('^/.*/$').test(compiler.options.output.publicPath) ? compiler.options.output.publicPath : '/';
          compilation.chunks.forEach(({ id, files, runtime }) => {
              const modules = Array.isArray(this.options.modules) ? this.options.modules : [ this.options.modules ];
              if (modules.find((oneEntry) => RegExp(`${oneEntry}$`).test(runtime))) {
                  this.config[runtime] = {
                      ...(this.config[runtime] || {}),
                      ...(id === runtime
                          ? { entry: Array.from(files).map((item) => `${prefix}${item}`) }
                          : {
                              modules: [ ...(this.config[runtime].modules || []), ...Array.from(files).map((item) => `${prefix}${item}`) ]
                          })
                  };
              }
          });

          const outputPath = this.options.output || compiler.options.output.path;
          mkdirSync(resolve(outputPath), { recursive: true });
          writeFileSync(`${resolve(outputPath, 'fed-mods.json')}`, JSON.stringify(this.config, null, 4));
      });
  }
}

module.exports = ChunkMapper;
