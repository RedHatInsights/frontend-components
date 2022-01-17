const webpack = require('webpack');

class ExtensionsMapper {
  constructor(plugin, options) {
    if (!plugin) {
      throw new Error('Missing plugin config!');
    }

    this.plugin = plugin;
    this.options = {
      remoteEntryCallback: 'window.loadPluginEntry',
      remoteEntryFile: 'plugin-entry.js',
      pluginManifestFile: 'plugin-manifest.json',
      ...options,
    };
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(ExtensionsMapper.name, (compilation) => {
      // Generate extensions manifest
      compilation.hooks.processAssets.tap(
        {
          name: ExtensionsMapper.name,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          compilation.emitAsset(
            this.options.pluginManifestFile,
            new webpack.sources.RawSource(
              Buffer.from(
                JSON.stringify(
                  {
                    version: '0.0.0',
                    description: '',
                    displayName: '',
                    dependencies: {},
                    disableStaticPlugins: {},
                    ...this.plugin,
                  },
                  null,
                  2
                )
              )
            )
          );
        }
      );

      // Update plugin-entry.js file
      compilation.hooks.processAssets.tap(
        {
          name: ExtensionsMapper.name,
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          compilation.updateAsset(this.options.remoteEntryFile, (source) => {
            const newSource = new webpack.sources.ReplaceSource(source);

            const fromIndex = source.source().toString().indexOf(`${this.options.remoteEntryCallback}(`);

            if (fromIndex < 0) {
              const error = new webpack.WebpackError(`Missing call to ${this.options.remoteEntryCallback}`);
              error.file = this.options.remoteEntryFile;
              compilation.errors.push(error);
            } else {
              newSource.insert(fromIndex + this.options.remoteEntryCallback.length + 1, `'${this.plugin.name}@${this.plugin.version}', `);
            }

            return newSource;
          });
        }
      );
    });
  }
}

module.exports = ExtensionsMapper;
