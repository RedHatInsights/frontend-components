/* global require, module */

class ChunkMapper {
    constructor(options) {
        this.config = {};
        this.options = options || {};
    }

    apply(compiler) {
        compiler.hooks.emit.tap('ChunkMapper', (compilation) => {
            const prefix = this.options.prefix || RegExp('^/.*/$').test(compiler.options.output.publicPath) ? compiler.options.output.publicPath : '/';
            compilation.chunks.forEach(({ name, files, runtime }) => {
                const modules = Array.isArray(this.options.modules) ? this.options.modules : [ this.options.modules ];
                if (modules.find((oneEntry) => RegExp(`${oneEntry}$`).test(runtime))) {
                    files = Array.from(files).map(item => `${prefix}${item}`);
                    this.config[runtime] = this.config[runtime] || {};
                    if (name === runtime) {
                      this.config[runtime].entry = this.config[runtime].entry || [];
                      this.config[runtime].entry.push(...files.filter((file, _index, array) => {
                          if (array.find(item => !RegExp('\\.hot-update\\.js$').test(item))) {
                              return !RegExp('\\.hot-update\\.js$').test(file);
                          }

                          return true;
                      }));
                    }
                    else {
                      this.config[runtime].modules = this.config[runtime].modules || [];
                      this.config[runtime].modules.push(...files)
                    };
                }
            });

            compilation.assets['fed-mods.json'] = {
                source: () => JSON.stringify(this.config, null, 4),
                size: () => JSON.stringify(this.config, null, 4).length
            };
        });
    }
}

module.exports = ChunkMapper;
