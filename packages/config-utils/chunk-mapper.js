const hotChunkRegex = RegExp('\\.hot-update\\.js$');
class ChunkMapper {
  constructor(options) {
    const { _unstableHotReload, ...rest } = options;
    this.config = {};
    this.options = rest || {};
    this._unstableHotReload = _unstableHotReload;
  }

  apply(compiler) {
    compiler.hooks.emit.tap('ChunkMapper', (compilation) => {
      const prefix = this.options.prefix || (RegExp('^/.*/$').test(compiler.options.output.publicPath) ? compiler.options.output.publicPath : '/');
      if (this._unstableHotReload) {
        const modules = Array.isArray(this.options.modules) ? this.options.modules : [this.options.modules];
        // TODO: Investigate if it is possible we could use the same script for normal builds
        const hotEntries = Array.from(compilation.chunks)
          .filter(({ name, runtime }) => !!modules.find((moduleName) => moduleName === name) || name === runtime)
          .map(({ files }) =>
            Array.from(files)
              .filter((file) => !hotChunkRegex.test(file))
              .map((file) => `${prefix}${file}`)
          )
          .flat();

        modules.forEach((name) => {
          this.config = {
            [name]: {
              entry: hotEntries,
            },
          };
        });
      } else {
        compilation.chunks.forEach(({ name, files, runtime }) => {
          const modules = Array.isArray(this.options.modules) ? this.options.modules : [this.options.modules];
          if (modules.find((oneEntry) => RegExp(`${oneEntry}$`).test(runtime))) {
            this.config[runtime] = {
              ...(this.config[runtime] || {}),
              ...(name === runtime
                ? {
                    entry: Array.from(files)
                      .map((item) => `${prefix}${item}`)
                      .filter((file, _index, array) => {
                        if (array.find((item) => !hotChunkRegex.test(item))) {
                          return !hotChunkRegex.test(file);
                        }

                        return true;
                      }),
                  }
                : {
                    modules: [...(this.config[runtime].modules || []), ...Array.from(files).map((item) => `${prefix}${item}`)],
                  }),
            };
          }
        });
      }

      compilation.assets['fed-mods.json'] = {
        source: () => JSON.stringify(this.config, null, 4),
        size: () => JSON.stringify(this.config, null, 4).length,
      };
    });
  }
}

module.exports = ChunkMapper;
